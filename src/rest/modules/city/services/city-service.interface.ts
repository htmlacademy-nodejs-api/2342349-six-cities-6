import {CityEntity} from '#src/rest/modules/city/city.entity.js';
import {City} from '#src/rest/modules/city/city.type.js';
import {Ref} from '@typegoose/typegoose';

export interface CityService {
  findOrCreate(cityData: City): Promise<CityEntity | null>;

  getAllCities(): Promise<CityEntity[]>;

  findByName(cityName: string): Promise<CityEntity | null>;

  getIdRefByName(cityName: string): Promise<Ref<CityEntity> | null>;
}
