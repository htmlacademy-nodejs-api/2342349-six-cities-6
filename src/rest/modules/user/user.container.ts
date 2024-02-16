import {MongoUserRepository} from '#src/rest/modules/user/repositories/mongo-user.repository.js';
import {UserRepository} from '#src/rest/modules/user/repositories/user-repository.interface.js';
import {DefaultUserService} from '#src/rest/modules/user/services/default-user.service.js';
import {UserService} from '#src/rest/modules/user/services/user-service.interface.js';
import {UserEntity, UserModel} from '#src/rest/modules/user/user.entity.js';
import {Component} from '#src/types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createUserContainer(): Container {
  const userContainer = new Container();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<UserRepository>(Component.UserRepository).to(MongoUserRepository).inSingletonScope();

  return userContainer;
}
