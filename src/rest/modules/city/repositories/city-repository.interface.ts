import {CityEntity} from '#src/rest/modules/city/city.entity.js';
import {City} from '#src/rest/modules/city/city.type.js';
import {DocumentType} from '@typegoose/typegoose';

export interface CityRepository {
  create(cityData: City): Promise<DocumentType<CityEntity>>;

  findById(cityId: string): Promise<DocumentType<CityEntity> | null>;

  findByName(cityName: string): Promise<DocumentType<CityEntity> | null>;

  findAllWithLimit(effectiveLimit: number): Promise<DocumentType<CityEntity>[]>;

  exists(cityId: string): Promise<boolean>;
}