import {DefaultUserService} from '#src/rest/modules/user/default-user.service.js';
import {UserService} from '#src/rest/modules/user/user-service.interface.js';
import {UserEntity, UserModel} from '#src/rest/modules/user/user.entity.js';
import {Component} from '#src/types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createUserContainer(): Container {
  const userContainer = new Container();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();

  return userContainer;
}
