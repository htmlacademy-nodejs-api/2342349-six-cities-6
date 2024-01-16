import {Citi} from '#src/types/citi.type.js';
import {Location} from '#src/types/location.type.js';
import {User} from '#src/types/user.type.js';

export enum OfferType {
  apartment = 'apartment',
  room = 'room',
  house = 'house',
  hotel = 'hotel'
}

export interface Offer {
  title: string,
  description: string,
  publicDate: Date,
  city: Citi,
  previewImage: string,
  images: string[],
  isPremium: boolean,
  isFavorite: boolean,
  rating: number,
  type: OfferType,
  room: number,
  bedroom: number,
  price: number,
  goods: string[],
  host: User,
  location: Location
}
