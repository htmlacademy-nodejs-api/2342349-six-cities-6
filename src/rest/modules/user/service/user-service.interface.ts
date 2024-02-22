import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {User} from '#src/rest/modules/user/type/user.type.js';
import {UserEntity} from '#src/rest/modules/user/user.entity.js';
import {Ref} from '@typegoose/typegoose';

export interface UserService {
  findOrCreate(userData: User): Promise<UserEntity>;

  create(userData: User): Promise<UserEntity>;

  findByMail(email: string): Promise<UserEntity | null>;

  findById(userId: string): Promise<UserEntity | null>;

  getIdRefByMail(userEmail: string): Promise<Ref<UserEntity> | null>;

  addFavoriteOffer(user: UserEntity, offer: OfferEntity): Promise<boolean>;

  deleteFavoriteOffer(user: UserEntity, offer: OfferEntity): Promise<boolean>;

  checkExists(userId: string): Promise<boolean>;

  login(userLogin: string, userPassword: string): Promise<boolean>;

  isLogin(): Promise<boolean>;

  logout(): Promise<boolean>;
}
