import {UserRepository} from '#src/rest/modules/user/repositories/user-repository.interface.js';
import {UserEntity} from '#src/rest/modules/user/user.entity.js';
import {User} from '#src/rest/modules/user/user.type.js';
import {Component} from '#src/types/component.enum.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

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

  public async exists(userId: string): Promise<boolean> {
    return this.userModel.exists({_id: userId}) !== null;
  }
}
