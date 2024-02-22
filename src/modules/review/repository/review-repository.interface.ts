import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {ReviewEntity} from '#src/modules/review/review.entity.js';
import {Review} from '#src/modules/review/type/review.type.js';
import {DocumentType, Ref} from '@typegoose/typegoose';
import mongoose from 'mongoose';

export interface ReviewRepository {
  create(reviewData: Review): Promise<DocumentType<ReviewEntity> | null>;

  findById(reviewId: string): Promise<DocumentType<ReviewEntity> | null>;

  findByOfferAndComment(offerId: string, reviewComment: string): Promise<DocumentType<ReviewEntity> | null>;

  findByOffer(offerId: string, effectiveLimit: number): Promise<DocumentType<ReviewEntity>[]>;

  exists(reviewId: mongoose.Types.ObjectId): Promise<boolean>;

  calculateAverageRating(offerIdRef: Ref<OfferEntity>): Promise<{ _id: Ref<OfferEntity>; averageRating: number; }[]>;
}
