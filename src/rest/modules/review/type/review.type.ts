import {Offer} from '#src/rest/modules/offer/type/offer.type.js';
import {User} from '#src/rest/modules/user/type/user.type.js';

export interface Review {
  comment: string,
  publishDate: Date,
  rating: number,
  author: User,
  offer: Offer
}
