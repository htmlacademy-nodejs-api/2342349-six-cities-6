import {CityEntity} from '#src/modules/city/city.entity.js';
import {CityRepository} from '#src/modules/city/repository/city-repository.interface.js';
import {CityService} from '#src/modules/city/service/city-service.interface.js';
import {City} from '#src/modules/city/type/city.type.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Component} from '#src/types/component.enum.js';
import {ListLimitsConfig} from '#src/utils/config.constants.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Ref} from '@typegoose/typegoose';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import mongoose from 'mongoose';

@injectable()
export class DefaultCityService implements CityService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CityRepository) private readonly cityRepository: CityRepository,
  ) {
  }

  public async findOrCreate(cityData: City): Promise<CityEntity> {
    const cityNameTrimmed = cityData.name.trim();
    const existedCity = await this.cityRepository.findByName(cityNameTrimmed);

    return existedCity ?? await this.createCityInternal(cityData);
  }

  public async getAllCities(): Promise<CityEntity[]> {
    const limit = ListLimitsConfig.CITY_LIST_LIMIT;
    const cities = await this.cityRepository.findAllWithLimit(limit);

    this.logger.info(`Retrieving all cities. Found ${cities.length} cities.`);
    return cities;
  }

  public async getIdRefByName(cityName: string): Promise<Ref<CityEntity> | null> {
    const cityNameTrimmed = cityName.trim();
    const foundCity = await this.cityRepository.findByName(cityNameTrimmed);

    return foundCity?.id ?? null;
  }

  public async checkExists(cityId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      return false;
    }
    const objectId = new mongoose.Types.ObjectId(cityId);
    return this.cityRepository.exists(objectId);
  }

  public async findByName(cityName: string): Promise<CityEntity | null> {
    const cityNameTrimmed = cityName.trim();
    const foundCity = await this.cityRepository.findByName(cityNameTrimmed);

    return foundCity ?? null;
  }

  private async createCityInternal(cityData: City): Promise<CityEntity> {
    try {
      const city = new CityEntity(cityData);
      const createdCity = await this.cityRepository.create(city);

      this.logger.info(`New [city] created: ${city.name}`);
      return createdCity;

    } catch (error) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error creating city '${cityData.name}'. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`,
        'CityService'
      );
    }
  }
}