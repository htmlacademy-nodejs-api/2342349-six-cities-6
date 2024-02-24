import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {ReviewEntity} from '#src/modules/review/review.entity.js';
import {Review} from '#src/modules/review/type/review.type.js';
import {DocumentExists} from '#src/rest/middleware/document-exists.interface.js';
import {Ref} from '@typegoose/typegoose';

export interface ReviewService extends DocumentExists {
  create(offerId: string, reviewData: Omit<Review, 'offer' | 'publishDate'>): Promise<ReviewEntity>;

  findByOffer(offerId: string, requestedLimit?: number): Promise<ReviewEntity[]>;

  findById(reviewId: string): Promise<ReviewEntity | null>;

  calculateAndSetRating(offerIdRef: Ref<OfferEntity>): Promise<boolean>;

  exists(reviewId: string): Promise<boolean>;
}
