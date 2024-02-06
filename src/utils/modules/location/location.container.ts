import {Component} from '#src/types/component.enum.js';
import {DefaultLocationService} from '#src/utils/modules/location/default-location.service.js';
import {LocationService} from '#src/utils/modules/location/location-service.interface.js';
import {LocationEntity, LocationModel} from '#src/utils/modules/location/location.entity.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createLocationContainer(): Container {
  const locationContainer = new Container();
  locationContainer.bind<types.ModelType<LocationEntity>>(Component.LocationModel).toConstantValue(LocationModel);
  locationContainer.bind<LocationService>(Component.LocationService).to(DefaultLocationService).inSingletonScope();

  return locationContainer;
}
