import {CreateUserDto} from '#src/utils/modules/user/create-user.dto.js';
import {UserEntity} from '#src/utils/modules/user/user.entity.js';
import {DocumentType} from '@typegoose/typegoose';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;

  findByMail(email: string): Promise<DocumentType<UserEntity> | null>;

  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
}
