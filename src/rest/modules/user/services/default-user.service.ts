import {UserRepository} from '#src/rest/modules/user/repositories/user-repository.interface.js';
import {UserService} from '#src/rest/modules/user/services/user-service.interface.js';
import {UserEntity} from '#src/rest/modules/user/user.entity.js';
import {User} from '#src/rest/modules/user/user.type.js';
import {Component} from '#src/types/component.enum.js';
import {CryptoProtocol} from '#src/utils/crypto/crypto.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {DocumentType, Ref} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Crypto) private readonly cryptoProtocol: CryptoProtocol,
    @inject(Component.UserRepository) private readonly userRepository: UserRepository
  ) {
  }

  public async findOrCreate(userData: User): Promise<UserEntity | null> {
    const userEmailTrimmed = userData.email.trim();
    const existedUser = await this.findByMail(userEmailTrimmed);

    return existedUser ?? await this.createUserInternal(userData);
  }

  public async findByMail(userEmail: string): Promise<DocumentType<UserEntity> | null> {
    const userEmailTrimmed = userEmail.trim();
    const foundUser = await this.userRepository.findByMail(userEmailTrimmed);

    return foundUser ?? null;
  }

  public async getIdRefByMail(userEmail: string): Promise<Ref<UserEntity> | null> {
    const userEmailTrimmed = userEmail.trim();
    const foundUser = await this.userRepository.findByMail(userEmailTrimmed);

    return foundUser?.id ?? null;
  }

  public async getFavoriteOffer(userId: string): Promise<string[] | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.error(`User id '${userId}' not found. Can't get favorite list`);
      return null;
    }
    return user.favoriteOffers;
  }

  public async addFavoriteOffer(userId: string, offerIdRef: string): Promise<boolean | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.error(`User id '${userId}' not found. Can't add element to favorite list`);
      return null;
    }
    const favoriteOfferIndex = user.favoriteOffers.indexOf(offerIdRef);
    if (favoriteOfferIndex === -1) {
      user.favoriteOffers.push(offerIdRef);
    }

    return this.saveUser(user);
  }

  public async deleteFavoriteOffer(userId: string, offerIdRef: string): Promise<boolean | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.error(`User id '${userId}' not found. Can't delete element from favorite list`);
      return false;
    }

    const favoriteOfferIndex = user.favoriteOffers.indexOf(offerIdRef);
    if (favoriteOfferIndex !== -1) {
      user.favoriteOffers.splice(favoriteOfferIndex, 1);
    }

    return this.saveUser(user);
  }

  private async createUserInternal(userData: User): Promise<UserEntity | null> {
    try {
      const passwordHash = await this.cryptoProtocol.hashPassword(userData.password);
      if (!passwordHash) {
        this.logger.error(`Can't create hash password for user '${userData.email}'`);
        return null;
      }

      const user = new UserEntity(userData, passwordHash);
      const createdUser = await this.userRepository.create(user);
      this.logger.info(`New [user] created: ${user.email}`);

      return createdUser;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error creating user '${userData.email}'. `, error);
      } else {
        this.logger.error(`Error creating user '${userData.email}'. An unknown error.`);
      }
      return null;
    }
  }

  private async saveUser(user: DocumentType<UserEntity>): Promise<boolean> {
    try {
      await user.save();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error saving user '${user.email}'. `, error);
      } else {
        this.logger.error(`Error saving user '${user.email}'. An unknown error.`);
      }
      return false;
    }
  }
}
