import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {UserRepository} from '#src/modules/user/repository/user-repository.interface.js';
import {UserService} from '#src/modules/user/service/user-service.interface.js';
import {User} from '#src/modules/user/type/user.type.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Component} from '#src/types/component.enum.js';
import {CryptoProtocol} from '#src/utils/crypto/crypto.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {DocumentType, Ref} from '@typegoose/typegoose';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import mongoose from 'mongoose';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Crypto) private readonly cryptoProtocol: CryptoProtocol,
    @inject(Component.UserRepository) private readonly userRepository: UserRepository
  ) {
  }

  public async create(userData: User): Promise<UserEntity> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email '${userData.email}' exists.`,
        'UserService'
      );
    }

    return await this.createUserInternal(userData);
  }

  public async login(userLogin: string, _userPassword: string): Promise<boolean> {
    const existingUser = await this.findByEmail(userLogin);
    if (!existingUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email '${userLogin}' not exists.`,
        'UserService'
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserService',
    );
  }

  public async checkExists(userId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return false;
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    return this.userRepository.exists(objectId);
  }

  public async isLoggedIn(): Promise<boolean> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserService',
    );
  }

  public async findOrCreate(userData: User): Promise<UserEntity> {
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

    return await this.userRepository.findByEmail(userEmailTrimmed);
  }

  public async getIdRefByEmail(userEmail: string): Promise<Ref<UserEntity> | null> {
    const userEmailTrimmed = userEmail.trim();
    const foundUser = await this.userRepository.findByEmail(userEmailTrimmed);

    return foundUser?.id ?? null;
  }

  public async findById(userId: string): Promise<UserEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }

    return await this.userRepository.findById(userId);
  }

  public async addFavoriteOffer(user: UserEntity, offer: OfferEntity): Promise<boolean> {
    const favoriteOfferIndex = user.favoriteOffers.indexOf(offer._id);
    if (favoriteOfferIndex === -1) {
      user.favoriteOffers.push(offer._id);
    }

    return this.saveUser(user);
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

  private async createUserInternal(userData: User): Promise<UserEntity> {
    const passwordHash = await this.cryptoProtocol.hashPassword(userData.password);
    if (!passwordHash) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Can't create hash password for user '${userData.email}'`,
        'UserService'
      );
    }

    try {
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

  public async deleteFavoriteOffer(user: UserEntity, offer: OfferEntity): Promise<boolean> {
    const favoriteOfferIndex = user.favoriteOffers.indexOf(offer._id);
    if (favoriteOfferIndex !== -1) {
      user.favoriteOffers.splice(favoriteOfferIndex, 1);
    }

    return this.saveUser(user);
  }
}
