import {Controller} from '#src/rest/controller/controller.interface.js';
import {CityController} from '#src/rest/modules/city/city.controller.js';
import {CityEntity, CityModel} from '#src/rest/modules/city/city.entity.js';
import {CityRepository} from '#src/rest/modules/city/repository/city-repository.interface.js';
import {MongoCityRepository} from '#src/rest/modules/city/repository/mongo-city.repository.js';
import {CityService} from '#src/rest/modules/city/service/city-service.interface.js';
import {DefaultCityService} from '#src/rest/modules/city/service/default-city.service.js';
import {Component} from '#src/types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createCityContainer(): Container {
  const cityContainer = new Container();
  cityContainer.bind<types.ModelType<CityEntity>>(Component.CityModel).toConstantValue(CityModel);
  cityContainer.bind<CityService>(Component.CityService).to(DefaultCityService).inSingletonScope();
  cityContainer.bind<CityRepository>(Component.CityRepository).to(MongoCityRepository).inSingletonScope();
  cityContainer.bind<Controller>(Component.CityController).to(CityController).inSingletonScope();

  return cityContainer;
}
