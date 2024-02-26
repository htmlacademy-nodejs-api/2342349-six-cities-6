import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {ReviewDTO} from '#src/modules/review/dto/review.dto.js';
import {ReviewEntity} from '#src/modules/review/review.entity.js';
import {DocumentType, Ref} from '@typegoose/typegoose';
import mongoose from 'mongoose';

export interface ReviewRepository {
  create(reviewData: ReviewDTO): Promise<DocumentType<ReviewEntity>>;

  findById(reviewId: string): Promise<DocumentType<ReviewEntity> | null>;

  findByOfferAndComment(offerId: Ref<OfferEntity>, reviewComment: string): Promise<DocumentType<ReviewEntity> | null>;

  findByOffer(offerId: string, effectiveLimit: number): Promise<DocumentType<ReviewEntity>[]>;

  exists(reviewId: mongoose.Types.ObjectId): Promise<boolean>;

  calculateAverageRating(offerIdRef: Ref<OfferEntity>): Promise<{ _id: Ref<OfferEntity>; averageRating: number; }[]>;
}
