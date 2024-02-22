import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {ReviewEntity} from '#src/rest/modules/review/review.entity.js';
import {Review} from '#src/rest/modules/review/type/review.type.js';
import {DocumentType, Ref} from '@typegoose/typegoose';
import mongoose from 'mongoose';

export interface ReviewRepository {
  create(reviewData: Review): Promise<DocumentType<ReviewEntity>>;

  findById(reviewId: string): Promise<DocumentType<ReviewEntity> | null>;

  findByComment(offerId: string, reviewComment: string): Promise<DocumentType<ReviewEntity> | null>;

  findByOffer(offerId: string, effectiveLimit: number): Promise<DocumentType<ReviewEntity>[]>;

  exists(reviewId: mongoose.Types.ObjectId): Promise<boolean>;

  getAverageRatingByOfferId(offerIdRef: Ref<OfferEntity>): Promise<{ _id: Ref<OfferEntity>; averageRating: number; }[]>;
}
