import {City} from '#src/rest/modules/city/type/city.type.js';
import {OfferType} from '#src/rest/modules/offer/type/offer.type.js';
import {User} from '#src/rest/modules/user/type/user.type.js';
import {Location} from '#src/types/location.type.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public publicDate!: Date;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public type!: OfferType;
  public room!: number;
  public bedroom!: number;
  public price!: number;
  public goods!: string[];
  public host!: User;
  public location!: Location;
}
