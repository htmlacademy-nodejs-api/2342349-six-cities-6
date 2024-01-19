import {Citi} from '#src/types/citi.type.js';
import {Location} from '#src/types/location.type.js';
import {OfferType} from '#src/types/offer.type.js';
import {UserType} from '#src/types/user.type.js';

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
