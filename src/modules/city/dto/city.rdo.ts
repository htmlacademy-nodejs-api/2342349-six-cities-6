import {Location} from '#src/types/location.type.js';
import {Expose, Transform} from 'class-transformer';

export class CityRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  @Transform(({obj}) => ({
    latitude: obj.geoLocation.coordinates[1],
    longitude: obj.geoLocation.coordinates[0]
  }))
  public location!: Location;
}
