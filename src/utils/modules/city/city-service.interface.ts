import {Citi} from '#src/utils/modules/city/citi.type.js';
import {CityEntity} from '#src/utils/modules/city/city.entity.js';
import {DocumentType} from '@typegoose/typegoose';

export interface CityService {
  fineOrCreate(cityData: Citi): Promise<DocumentType<CityEntity>>;

  findById(id: number): Promise<DocumentType<CityEntity> | null>;

  findByName(cityName: string): Promise<DocumentType<CityEntity> | null>;
}
