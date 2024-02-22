import {Offer} from '#src/modules/offer/type/offer.type.js';
import {User} from '#src/modules/user/type/user.type.js';

export class CreateReviewDto {
  author!: User;
  comment!: string;
  offer!: Offer;
  rating!: number;
}
