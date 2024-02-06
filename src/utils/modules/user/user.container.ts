import {Component} from '#src/types/component.enum.js';
import {DefaultUserService} from '#src/utils/modules/user/default-user.service.js';
import {UserService} from '#src/utils/modules/user/user-service.interface.js';
import {UserEntity, UserModel} from '#src/utils/modules/user/user.entity.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createUserContainer(): Container {
  const userContainer = new Container();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();

  return userContainer;
}
