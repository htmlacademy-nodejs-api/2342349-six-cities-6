import {Controller} from '#src/rest/controller/controller.interface.js';
import {MongoUserRepository} from '#src/rest/modules/user/repository/mongo-user.repository.js';
import {UserRepository} from '#src/rest/modules/user/repository/user-repository.interface.js';
import {DefaultUserService} from '#src/rest/modules/user/service/default-user.service.js';
import {UserService} from '#src/rest/modules/user/service/user-service.interface.js';
import {UserController} from '#src/rest/modules/user/user.controller.js';
import {UserEntity, UserModel} from '#src/rest/modules/user/user.entity.js';
import {Component} from '#src/types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createUserContainer(): Container {
  const userContainer = new Container();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<UserRepository>(Component.UserRepository).to(MongoUserRepository).inSingletonScope();
  userContainer.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();

  return userContainer;
}
