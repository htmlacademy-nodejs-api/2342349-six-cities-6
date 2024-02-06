import {Component} from '#src/types/component.enum.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Citi} from '#src/utils/modules/city/citi.type.js';
import {CityService} from '#src/utils/modules/city/city-service.interface.js';
import {CityEntity} from '#src/utils/modules/city/city.entity.js';
import {LocationService} from '#src/utils/modules/location/location-service.interface.js';
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

  public async fineOrCreate(cityData: Citi): Promise<DocumentType<CityEntity>> {
    const existedCity = await this.findByName(cityData.name);
    if (existedCity) {
      return existedCity;
    }
    return this.create(cityData);
  }

  private async create(cityData: Citi): Promise<DocumentType<CityEntity>> {
    const {location: locationData} = cityData;
    const location = await this.locationService.fineOrCreate(locationData);

    const city = new CityEntity(cityData, location.id);
    const result = await this.cityModel.create(city);
    this.logger.info(`New city created: ${city.name}`);

    return result;
  }
}
