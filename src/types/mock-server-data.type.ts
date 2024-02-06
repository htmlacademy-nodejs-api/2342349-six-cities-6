import {Citi} from '#src/utils/modules/city/citi.type.js';
import {Location} from '#src/utils/modules/location/location.type.js';
import {OfferType} from '#src/utils/modules/offer/offer.type.js';
import {UserType} from '#src/utils/modules/user/user.type.js';

export interface MockServerData {
  titles: string[];
  descriptions: string[];
  cities: Citi[];
  previewImages: string[];
  images: string[];
  isPremium: boolean[];
  isFavorite: boolean[];
  types: OfferType[];
  goods: string[];
  hostNames: string[];
  hostEmails: string[];
  hostAvatarUrls: string[];
  hostPasswords: string[];
  hostTypes: UserType[];
  locations: Location[];
}
