import {Citi} from '#src/utils/modules/city/citi.type.js';
import {LocationEntity} from '#src/utils/modules/location/location.entity.js';
import {Location} from '#src/utils/modules/location/location.type.js';
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
export class CityEntity extends defaultClasses.TimeStamps implements Citi {
  @prop({required: true, trim: true, unique: true, type: String})
  public name: string;

  @prop({required: true, ref: LocationEntity})
  public locationId: Ref<LocationEntity>;

  public location: Location;

  // todo locationId: Ref<LocationEntity> и второй location
  constructor(cityData: Citi, locationId: Ref<LocationEntity>) {
    super();
    this.name = cityData.name;
    this.location = cityData.location;
    this.locationId = locationId;
  }
}

export const CityModel = getModelForClass(CityEntity);
