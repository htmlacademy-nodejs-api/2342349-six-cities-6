import {Citi} from './citi.type.js';
import {Location} from './location.type.js';
import {User} from './user.type.js';

export type OfferType = 'apartment' | 'room' | 'house' | 'hotel';

export type Offer = {
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
