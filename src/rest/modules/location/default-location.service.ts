import {LocationService} from '#src/rest/modules/location/location-service.interface.js';
import {LocationEntity} from '#src/rest/modules/location/location.entity.js';
import {Location} from '#src/rest/modules/location/location.type.js';
import {Component} from '#src/types/component.enum.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

@injectable()
export class DefaultLocationService implements LocationService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.LocationModel) private readonly locationModel: types.ModelType<LocationEntity>,
  ) {
  }

  public async findById(locationId: number): Promise<DocumentType<LocationEntity> | null> {
    return this.locationModel.findById(locationId);
  }

  public async findByCoordinates(cityLongitude: number, cityLatitude: number): Promise<DocumentType<LocationEntity> | null> {
    return this.locationModel.findOne({longitude: cityLongitude, latitude: cityLatitude});
  }

  public async fineOrCreate(locationData: Location): Promise<DocumentType<LocationEntity>> {
    const existedLocation = await this.findByCoordinates(locationData.longitude, locationData.latitude);
    if (existedLocation) {
      return existedLocation;
    }
    return this.create(locationData);
  }

  private async create(locationData: Location): Promise<DocumentType<LocationEntity>> {
    const location = new LocationEntity(locationData);
    const result = await this.locationModel.create(location);
    this.logger.info(`New location with coordinates ${location.latitude} ${location.longitude} created`);

    return result;
  }
}
