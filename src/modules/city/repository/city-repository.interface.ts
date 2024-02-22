import {CityEntity} from '#src/modules/city/city.entity.js';
import {City} from '#src/modules/city/type/city.type.js';
import {DocumentType} from '@typegoose/typegoose';
import mongoose from 'mongoose';

export interface CityRepository {
  create(cityData: City): Promise<DocumentType<CityEntity>>;

  findById(cityId: string): Promise<DocumentType<CityEntity> | null>;

  findByName(cityName: string): Promise<DocumentType<CityEntity> | null>;

  listLimited(effectiveLimit: number): Promise<DocumentType<CityEntity>[]>;

  exists(cityId: mongoose.Types.ObjectId): Promise<boolean>;
}
