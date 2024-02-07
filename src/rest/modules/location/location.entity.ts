import {Location} from '#src/rest/modules/location/location.type.js';
import {defaultClasses, getModelForClass, modelOptions, prop} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface LocationEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'locations',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class LocationEntity extends defaultClasses.TimeStamps implements Location {
  @prop({required: true})
  public latitude: number;

  @prop({required: true})
  public longitude: number;

  constructor(locationData: Location) {
    super();
    this.latitude = locationData.latitude;
    this.longitude = locationData.longitude;
  }
}

export const LocationModel = getModelForClass(LocationEntity);
