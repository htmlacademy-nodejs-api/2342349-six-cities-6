import {City} from '#src/rest/modules/city/city.type.js';
import {LocationEntity} from '#src/rest/modules/location/location.entity.js';
import {Location} from '#src/rest/modules/location/location.type.js';
import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CityEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'cities',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CityEntity extends defaultClasses.TimeStamps implements City {
  @prop({required: true, trim: true, unique: true})
  public name: string;

  @prop({required: true, ref: LocationEntity})
  public locationId: Ref<LocationEntity>;

  public location: Location;

  constructor(cityData: City, locationId: Ref<LocationEntity>) {
    super();
    this.name = cityData.name;
    this.location = cityData.location;
    this.locationId = locationId;
  }
}

export const CityModel = getModelForClass(CityEntity);
