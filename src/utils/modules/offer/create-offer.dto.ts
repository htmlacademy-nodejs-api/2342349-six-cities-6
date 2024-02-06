import {Citi} from '#src/utils/modules/city/citi.type.js';
import {Location} from '#src/utils/modules/location/location.type.js';
import {OfferType} from '#src/utils/modules/offer/offer.type.js';
import {User} from '#src/utils/modules/user/user.type.js';

export class CreateOfferDto {
  constructor(
    public title: string,
    public description: string,
    public publicDate: Date,
    public city: Citi,
    public previewImage: string,
    public images: string[],
    public isPremium: boolean,
    public isFavorite: boolean,
    public rating: number,
    public type: OfferType,
    public room: number,
    public bedroom: number,
    public price: number,
    public goods: string[],
    public host: User,
    public location: Location
  ) {
  }
}
