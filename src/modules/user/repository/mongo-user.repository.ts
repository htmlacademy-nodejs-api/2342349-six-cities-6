import {UserRepository} from '#src/modules/user/repository/user-repository.interface.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {Component} from '#src/types/component.enum.js';
import {MongooseObjectId} from '#src/types/mongoose-objectid.type.js';
import {DocumentType, Ref, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

@injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @inject(Component.UserModel) private userModel: types.ModelType<UserEntity>,
  ) {
  }

  public async create(userData: UserEntity): Promise<DocumentType<UserEntity>> {
    return this.userModel.create(userData);
  }

  public async findById(userIdRef: Ref<UserEntity>): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userIdRef);
  }

  public async findByEmail(userEmail: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email: userEmail});
  }

  public async exists(userId: MongooseObjectId): Promise<boolean> {
    const isUserExists = await this.userModel.exists({_id: userId});
    return !!isUserExists;
  }
}
