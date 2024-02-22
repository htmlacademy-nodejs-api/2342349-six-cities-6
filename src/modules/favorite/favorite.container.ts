import {FavoriteController} from '#src/modules/favorite/favorite.controller.js';
import {DefaultFavoriteService} from '#src/modules/favorite/service/default-favorite.service.js';
import {FavoriteService} from '#src/modules/favorite/service/favorite-service.interface.js';
import {Controller} from '#src/rest/controller/controller.interface.js';
import {Component} from '#src/types/component.enum.js';
import {Container} from 'inversify';

export function createFavoriteContainer(): Container {
  const favoriteContainer = new Container();
  favoriteContainer.bind<FavoriteService>(Component.FavoriteService).to(DefaultFavoriteService).inSingletonScope();
  favoriteContainer.bind<Controller>(Component.FavoriteController).to(FavoriteController).inSingletonScope();

  return favoriteContainer;
}
