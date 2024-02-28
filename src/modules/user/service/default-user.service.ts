import {AuthService} from '#src/modules/auth/auth-service.interface.js';
import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {CreateUserDTO} from '#src/modules/user/dto/create-user.dto.js';
import {UserDTO} from '#src/modules/user/dto/user.dto.js';
import {UserRepository} from '#src/modules/user/repository/user-repository.interface.js';
import {UserService} from '#src/modules/user/service/user-service.interface.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {USERPROFILECONFIG} from '#src/rest/config.constant.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Component} from '#src/type/component.enum.js';
import {MongooseObjectId} from '#src/type/mongoose-objectid.type.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {DocumentType, Ref} from '@typegoose/typegoose';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserRepository) private readonly userRepository: UserRepository,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
  }

  public async create(userParams: CreateUserDTO): Promise<UserEntity> {
    const existingUser = await this.findByEmail(userParams.email);
    if (existingUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email '${userParams.email}' exists.`,
        'UserService'
      );
    }
    const userData: UserDTO = {
      ...userParams,
      avatarUrl: userParams.avatarUrl ?? USERPROFILECONFIG.AVATAR_DEFAULT_URL
    };

    return this.createUserInternal(userData);
  }

  public async login(inputLogin: string, inputPassword: string): Promise<string> {
    const existingUser = await this.findByEmail(inputLogin);
    const userVerified = await this.authService.verify(inputLogin, inputPassword, existingUser);
    const authenticatedUserToken = await this.authService.authenticate(userVerified);

    this.logger.info(`User '${userVerified.email}' successfully authenticated.`);
    return authenticatedUserToken;
  }

  public async exists(userId: string): Promise<boolean> {
    if (!MongooseObjectId.isValid(userId)) {
      return false;
    }

    const objectId = new MongooseObjectId(userId);
    return this.userRepository.exists(objectId);
  }

  public async checkAuthenticate(email: string): Promise<boolean> {
    const foundUser = await this.userRepository.findByEmail(email);
    if (!foundUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserService'
      );
    }

    return true;
  }

  public async findOrCreate(userData: UserDTO): Promise<UserEntity> {
    const userEmailTrimmed = userData.email.trim();
    const existedUser = await this.findByEmail(userEmailTrimmed);

    return existedUser ?? await this.createUserInternal(userData);
  }

  public async logout(): Promise<boolean> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserService',
    );
  }

  public async findByEmail(userEmail: string): Promise<DocumentType<UserEntity> | null> {
    const userEmailTrimmed = userEmail.trim();

    return this.userRepository.findByEmail(userEmailTrimmed);
  }

  public async getIdRefByEmail(userEmail: string): Promise<Ref<UserEntity> | null> {
    const userEmailTrimmed = userEmail.trim();
    const foundUser = await this.userRepository.findByEmail(userEmailTrimmed);

    return foundUser?.id ?? null;
  }

  public async findById(userIdRef: Ref<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findById(userIdRef);
  }

  private async saveUser(user: UserEntity): Promise<boolean> {
    try {
      const userDocument = user as DocumentType<UserEntity>;
      await userDocument.save();

      this.logger.info(`User '${user.email}' updated`);
      return true;

    } catch (error) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error saving user '${user.email}'. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`,
        'UserService'
      );
    }
  }

  public async getFavoriteOffers(userIdRef: Ref<UserEntity>): Promise<Ref<OfferEntity>[]> {
    const currentUser = await this.findById(userIdRef);
    if (!currentUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with ID '${userIdRef.toString()}' not found.`,
        'UserService'
      );
    }

    return currentUser.favoriteOffers;
  }

  public async addOfferToFavorites(userIdRef: Ref<UserEntity>, offerIdRef: Ref<OfferEntity>): Promise<boolean> {
    const currentUser = await this.findById(userIdRef);
    if (!currentUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with ID '${userIdRef.toString()}' not found.`,
        'UserService'
      );
    }

    const favoriteOfferIndex = currentUser.favoriteOffers.indexOf(offerIdRef);
    if (favoriteOfferIndex === -1) {
      currentUser.favoriteOffers.push(offerIdRef);
    }

    this.logger.info(`Offer ID '${offerIdRef.toString()}' added to favorite for user '${currentUser.email}'.`);
    return this.saveUser(currentUser);
  }

  public async removeOfferFromFavorites(userIdRef: Ref<UserEntity>, offerIdRef: Ref<OfferEntity>): Promise<boolean> {
    const currentUser = await this.findById(userIdRef);
    if (!currentUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with ID '${userIdRef.toString()}' not found.`,
        'UserService'
      );
    }

    const favoriteOfferIndex = currentUser.favoriteOffers.indexOf(offerIdRef);
    if (favoriteOfferIndex !== -1) {
      currentUser.favoriteOffers.splice(favoriteOfferIndex, 1);
    }

    this.logger.info(`Offer ID '${offerIdRef.toString()}' deleted from favorite for user '${currentUser.email}'.`);
    return this.saveUser(currentUser);
  }

  private async createUserInternal(userData: UserDTO): Promise<UserEntity> {
    try {
      const passwordHash = await this.authService.encryptInputPassword(userData.password);
      const user = new UserEntity(userData, passwordHash);
      const createdUser = await this.userRepository.create(user);

      this.logger.info(`New [user] created: ${user.email}`);
      return createdUser;

    } catch (error) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error creating user '${userData.email}'. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`,
        'UserService'
      );
    }
  }
}
