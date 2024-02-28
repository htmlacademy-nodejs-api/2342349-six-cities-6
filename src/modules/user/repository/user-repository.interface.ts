import {UserEntity} from '#src/modules/user/user.entity.js';
import {MongooseObjectId} from '#src/types/mongoose-objectid.type.js';
import {DocumentType, Ref} from '@typegoose/typegoose';

export interface UserRepository {
  create(userData: UserEntity): Promise<DocumentType<UserEntity>>;

  findById(userIdRef: Ref<UserEntity>): Promise<DocumentType<UserEntity> | null>;

  findByEmail(userEmail: string): Promise<DocumentType<UserEntity> | null>;

  exists(userId: MongooseObjectId): Promise<boolean>;
}
