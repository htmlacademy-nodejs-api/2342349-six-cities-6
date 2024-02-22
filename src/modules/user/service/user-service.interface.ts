import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {User} from '#src/modules/user/type/user.type.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {Ref} from '@typegoose/typegoose';

export interface UserService {
  findOrCreate(userData: User): Promise<UserEntity>;

  create(userData: User): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserEntity | null>;

  findById(userId: string): Promise<UserEntity | null>;

  getIdRefByEmail(userEmail: string): Promise<Ref<UserEntity> | null>;

  addFavoriteOffer(user: UserEntity, offer: OfferEntity): Promise<boolean>;

  deleteFavoriteOffer(user: UserEntity, offer: OfferEntity): Promise<boolean>;

  checkExists(userId: string): Promise<boolean>;

  login(userLogin: string, userPassword: string): Promise<boolean>;

  isLoggedIn(): Promise<boolean>;

  logout(): Promise<boolean>;
}
