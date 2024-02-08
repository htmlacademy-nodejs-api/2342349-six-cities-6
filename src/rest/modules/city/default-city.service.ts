import {CityService} from '#src/rest/modules/city/city-service.interface.js';
import {CityEntity} from '#src/rest/modules/city/city.entity.js';
import {City} from '#src/rest/modules/city/city.type.js';
import {LocationService} from '#src/rest/modules/location/location-service.interface.js';
import {Component} from '#src/types/component.enum.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

@injectable()
export class DefaultCityService implements CityService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CityModel) private readonly cityModel: types.ModelType<CityEntity>,
    @inject(Component.LocationService) private readonly locationService: LocationService,
  ) {
  }

  public async findById(cityId: number): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findById(cityId);
  }

  public async findByName(cityName: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({name: cityName});
  }

  public async fineOrCreate(cityData: City): Promise<DocumentType<CityEntity>> {
    const existedCity = await this.findByName(cityData.name);
    if (existedCity) {
      return existedCity;
    }
    return this.create(cityData);
  }

  private async create(cityData: City): Promise<DocumentType<CityEntity>> {
    const {location: locationData} = cityData;
    const location = await this.locationService.fineOrCreate(locationData);

    const city = new CityEntity(cityData, location.id);
    const result = await this.cityModel.create(city);
    this.logger.info(`New city created: ${city.name}`);

    return result;
  }
}
