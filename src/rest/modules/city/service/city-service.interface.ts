import {CityEntity} from '#src/rest/modules/city/city.entity.js';
import {City} from '#src/rest/modules/city/type/city.type.js';
import {Ref} from '@typegoose/typegoose';

export interface CityService {
  findOrCreate(cityData: City): Promise<CityEntity>;

  getAllCities(): Promise<CityEntity[]>;

  findByName(cityName: string): Promise<CityEntity | null>;

  getIdRefByName(cityName: string): Promise<Ref<CityEntity> | null>;

  checkExists(cityId: string): Promise<boolean>;
}
