import {CityEntity} from '#src/modules/city/city.entity.js';
import {CityRepository} from '#src/modules/city/repository/city-repository.interface.js';
import {City} from '#src/modules/city/type/city.type.js';
import {Component} from '#src/types/component.enum.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import mongoose from 'mongoose';

@injectable()
export class MongoCityRepository implements CityRepository {
  constructor(
    @inject(Component.CityModel) private cityModel: types.ModelType<CityEntity>,
  ) {
  }

  public async create(cityData: City): Promise<DocumentType<CityEntity>> {
    return this.cityModel.create(cityData);
  }

  public async findById(cityId: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findById(cityId);
  }

  public async findByName(cityName: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({name: cityName});
  }

  public async findAllWithLimit(effectiveLimit: number): Promise<DocumentType<CityEntity>[]> {
    return this.cityModel.find({}, {}, {limit: effectiveLimit});
  }

  public async exists(cityId: mongoose.Types.ObjectId): Promise<boolean> {
    const isCityExists = await this.cityModel.exists({_id: cityId});
    return !!isCityExists;
  }
}
