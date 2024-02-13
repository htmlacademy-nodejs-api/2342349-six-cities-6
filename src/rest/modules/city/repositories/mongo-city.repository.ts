import {CityEntity} from '#src/rest/modules/city/city.entity.js';
import {City} from '#src/rest/modules/city/city.type.js';
import {CityRepository} from '#src/rest/modules/city/repositories/city-repository.interface.js';
import {Component} from '#src/types/component.enum.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

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
    const cityNameTrimmed = cityName.trim();
    return this.cityModel.findOne({name: cityNameTrimmed});
  }

  public async findAllWithLimit(effectiveLimit: number): Promise<DocumentType<CityEntity>[]> {
    return this.cityModel.find({}, {}, {limit: effectiveLimit});
  }

  public async exists(cityId: string): Promise<boolean> {
    return this.cityModel.exists({_id: cityId}) !== null;
  }
}
