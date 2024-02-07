import {CityEntity} from '#src/rest/modules/city/city.entity.js';
import {City} from '#src/rest/modules/city/city.type.js';
import {DocumentType} from '@typegoose/typegoose';

export interface CityService {
  fineOrCreate(cityData: City): Promise<DocumentType<CityEntity>>;

  findById(id: number): Promise<DocumentType<CityEntity> | null>;

  findByName(cityName: string): Promise<DocumentType<CityEntity> | null>;
}
