import {City} from '#src/rest/modules/city/city.type.js';
import {Location} from '#src/rest/modules/location/location.type.js';
import {OfferType} from '#src/rest/modules/offer/offer.type.js';
import {UserType} from '#src/rest/modules/user/user.type.js';

export interface MockServerData {
  titles: string[];
  descriptions: string[];
  cities: City[];
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
