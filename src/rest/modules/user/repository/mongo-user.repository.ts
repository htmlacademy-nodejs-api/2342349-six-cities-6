import {UserRepository} from '#src/rest/modules/user/repository/user-repository.interface.js';
import {User} from '#src/rest/modules/user/type/user.type.js';
import {UserEntity} from '#src/rest/modules/user/user.entity.js';
import {Component} from '#src/types/component.enum.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import mongoose from 'mongoose';

@injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @inject(Component.UserModel) private userModel: types.ModelType<UserEntity>,
  ) {
  }

  public async create(userData: User): Promise<DocumentType<UserEntity>> {
    return this.userModel.create(userData);
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId);
  }

  public async findByMail(userEmail: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email: userEmail});
  }

  public async exists(userId: mongoose.Types.ObjectId): Promise<boolean> {
    const isUserExists = await this.userModel.exists({_id: userId});
    return !!isUserExists;
  }
}
