import {UserEntity} from '#src/utils/modules/user/user.entity.js';
import {User} from '#src/utils/modules/user/user.type.js';
import {DocumentType} from '@typegoose/typegoose';

export interface UserService {
  findOrCreate(userData: User): Promise<DocumentType<UserEntity>>;
  findByMail(email: string): Promise<DocumentType<UserEntity> | null>;
}
