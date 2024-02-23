import {CityEntity} from '#src/modules/city/city.entity.js';
import {City} from '#src/modules/city/type/city.type.js';
import {Ref} from '@typegoose/typegoose';

export interface CityService {
  findOrCreate(cityData: City): Promise<CityEntity>;

  listAll(): Promise<CityEntity[]>;

  findByName(cityName: string): Promise<CityEntity | null>;

  getIdRefByName(cityName: string): Promise<Ref<CityEntity> | null>;

  checkExists(cityId: string): Promise<boolean>;

  findById(cityId: string): Promise<CityEntity | null>;
}
