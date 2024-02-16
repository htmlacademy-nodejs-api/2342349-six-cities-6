import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {ReviewEntity} from '#src/rest/modules/review/review.entity.js';
import {Review} from '#src/rest/modules/review/review.type.js';
import {Ref} from '@typegoose/typegoose';

export interface ReviewService {
  findOrCreate(reviewData: Review): Promise<ReviewEntity | null>;

  findByOffer(offerId: string, requestedLimit?: number): Promise<ReviewEntity[]>;

  calculateAndSetOfferRating(offerIdRef: Ref<OfferEntity>): Promise<boolean | null>;
}
