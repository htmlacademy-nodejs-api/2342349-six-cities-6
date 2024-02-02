import {CreateUserDto} from '#src/utils/modules/user/create-user.dto.js';
import {UserService} from '#src/utils/modules/user/user-service.interface.js';
import {UserEntity, UserModel} from '#src/utils/modules/user/user.entity.js';
import {DocumentType} from '@typegoose/typegoose';
import {Promise} from 'mongoose';

export class DefaultUserService implements UserService {
  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto, salt);
    return UserModel.create(user);
  }

  public async findByMail(email: string): Promise<DocumentType<UserEntity> | null> {
    return UserModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByMail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

}
