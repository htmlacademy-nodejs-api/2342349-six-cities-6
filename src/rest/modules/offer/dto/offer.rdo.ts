import {CityRdo} from '#src/rest/modules/city/dto/city.rdo.js';
import {City} from '#src/rest/modules/city/type/city.type.js';
import {OfferType} from '#src/rest/modules/offer/type/offer.type.js';
import {UserRdo} from '#src/rest/modules/user/dto/user.rdo.js';
import {User} from '#src/rest/modules/user/type/user.type.js';
import {Location} from '#src/types/location.type.js';
import {Expose, Transform, Type} from 'class-transformer';

export class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public bedroom!: number;

  @Expose({name: 'cityId'})
  @Type(() => CityRdo)
  public city!: City;

  @Expose()
  public description!: string;

  @Expose()
  public goods!: string[];

  @Expose({name: 'hostId'})
  @Type(() => UserRdo)
  public host!: User;

  @Expose()
  public images!: string[];

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  @Transform(({obj}) => ({
    latitude: obj.geoLocation.coordinates[1],
    longitude: obj.geoLocation.coordinates[0]
  }))
  public location!: Location;

  @Expose()
  public previewImage!: string;

  @Expose()
  public price!: number;

  @Expose()
  public publicDate!: Date;

  @Expose()
  public rating!: number;

  @Expose()
  public room!: number;

  @Expose()
  public title!: string;

  @Expose()
  public type!: OfferType;
}
