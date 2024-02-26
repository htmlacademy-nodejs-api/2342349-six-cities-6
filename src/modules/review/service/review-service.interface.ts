import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {CreateReviewDto} from '#src/modules/review/dto/create-review.dto.js';
import {ReviewEntity} from '#src/modules/review/review.entity.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {DocumentExists} from '#src/rest/middleware/document-exists.interface.js';
import {Ref} from '@typegoose/typegoose';

export interface ReviewService extends DocumentExists {
  create(authorIdRef: Ref<UserEntity>, offerIdRef: Ref<OfferEntity>, reviewData: CreateReviewDto): Promise<ReviewEntity>;

  findByOffer(offerId: string, requestedLimit?: number): Promise<ReviewEntity[]>;

  findById(reviewId: string): Promise<ReviewEntity | null>;

  calculateAndSetRating(offerIdRef: Ref<OfferEntity>): Promise<boolean>;

  exists(reviewId: string): Promise<boolean>;
}
