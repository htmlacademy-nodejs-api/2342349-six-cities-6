import {User} from '#src/rest/modules/user/type/user.type.js';
import {UserEntity} from '#src/rest/modules/user/user.entity.js';
import {DocumentType} from '@typegoose/typegoose';
import mongoose from 'mongoose';

export interface UserRepository {
  create(userData: User): Promise<DocumentType<UserEntity>>;

  findById(userId: string): Promise<DocumentType<UserEntity> | null>;

  findByMail(userEmail: string): Promise<DocumentType<UserEntity> | null>;

  exists(userId: mongoose.Types.ObjectId): Promise<boolean>;
}
