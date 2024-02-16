import {UserEntity} from '#src/rest/modules/user/user.entity.js';
import {User} from '#src/rest/modules/user/user.type.js';
import {Ref} from '@typegoose/typegoose';

export interface UserService {
  findOrCreate(userData: User): Promise<UserEntity | null>;

  findByMail(email: string): Promise<UserEntity | null>;

  getIdRefByMail(userEmail: string): Promise<Ref<UserEntity> | null>;

  getFavoriteOffer(userId: string): Promise<string[] | null>;

  addFavoriteOffer(userId: string, offerIdRef: string): Promise<boolean | null>;

  deleteFavoriteOffer(userId: string, offerIdRef: string): Promise<boolean | null>;
}
