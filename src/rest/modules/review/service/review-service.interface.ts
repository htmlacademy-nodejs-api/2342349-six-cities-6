import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {ReviewEntity} from '#src/rest/modules/review/review.entity.js';
import {Review} from '#src/rest/modules/review/type/review.type.js';
import {Ref} from '@typegoose/typegoose';

export interface ReviewService {
  create(offerId: string, reviewData: Omit<Review, 'offer' | 'publishDate'>): Promise<boolean>;

  findByOffer(offerId: string, requestedLimit?: number): Promise<ReviewEntity[]>;

  calculateAndSetOfferRating(offerIdRef: Ref<OfferEntity>): Promise<boolean>;

  checkExists(reviewId: string): Promise<boolean>;
}
