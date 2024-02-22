import {CityRdo} from '#src/rest/modules/city/dto/city.rdo.js';
import {City} from '#src/rest/modules/city/type/city.type.js';
import {OfferType} from '#src/rest/modules/offer/type/offer.type.js';
import {Location} from '#src/types/location.type.js';
import {Expose, Transform, Type} from 'class-transformer';

export class ShortOfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public price!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public publicDate!: Date;

  @Expose({name: 'cityId'})
  @Type(() => CityRdo)
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public rating!: number;

  @Expose()
  @Transform(({obj}) => ({
    latitude: obj.geoLocation.coordinates[1],
    longitude: obj.geoLocation.coordinates[0]
  }))
  public location!: Location;
}
