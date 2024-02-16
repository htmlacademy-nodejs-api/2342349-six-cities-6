import {UserEntity} from '#src/rest/modules/user/user.entity.js';
import {User} from '#src/rest/modules/user/user.type.js';
import {DocumentType} from '@typegoose/typegoose';

export interface UserRepository {
  create(userData: User): Promise<DocumentType<UserEntity>>;

  findById(userId: string): Promise<DocumentType<UserEntity> | null>;

  findByMail(userEmail: string): Promise<DocumentType<UserEntity> | null>;

  exists(userId: string): Promise<boolean>;
}
