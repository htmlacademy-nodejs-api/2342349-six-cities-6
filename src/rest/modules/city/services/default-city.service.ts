import {CityEntity} from '#src/rest/modules/city/city.entity.js';
import {City} from '#src/rest/modules/city/city.type.js';
import {CityRepository} from '#src/rest/modules/city/repositories/city-repository.interface.js';
import {CityService} from '#src/rest/modules/city/services/city-service.interface.js';
import {Component} from '#src/types/component.enum.js';
import {EntityConfig} from '#src/utils/config.constants.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Ref} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

@injectable()
export class DefaultCityService implements CityService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CityRepository) private readonly cityRepository: CityRepository,
  ) {
  }

  public async findOrCreate(cityData: City): Promise<CityEntity | null> {
    const cityNameTrimmed = cityData.name.trim();
    const existedCity = await this.cityRepository.findByName(cityNameTrimmed);

    return existedCity ?? await this.createCityInternal(cityData);
  }

  public async getIdRefByName(cityName: string): Promise<Ref<CityEntity> | null> {
    const cityNameTrimmed = cityName.trim();
    const foundCity = await this.cityRepository.findByName(cityNameTrimmed);

    return foundCity?.id ?? null;
  }

  public async getAllCities(): Promise<CityEntity[]> {
    const limit = EntityConfig.CITY_LIST_LIMIT;
    const cities = await this.cityRepository.findAllWithLimit(limit);

    this.logger.info(`Retrieving all cities. Found ${cities.length} cities.`);
    return cities;
  }

  public async findByName(cityName: string): Promise<CityEntity | null> {
    const cityNameTrimmed = cityName.trim();
    const foundCity = await this.cityRepository.findByName(cityNameTrimmed);

    return foundCity ?? null;
  }

  private async createCityInternal(cityData: City): Promise<CityEntity | null> {
    try {
      const city = new CityEntity(cityData);
      const createdCity = await this.cityRepository.create(city);
      this.logger.info(`New [city] created: ${city.name}`);

      return createdCity;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error creating city '${cityData.name}'. `, error);
      } else {
        this.logger.error(`Error creating city '${cityData.name}'. An unknown error.`);
      }
      return null;
    }
  }
}
