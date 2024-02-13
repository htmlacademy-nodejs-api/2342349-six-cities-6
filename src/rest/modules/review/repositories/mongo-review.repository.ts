import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {ReviewRepository} from '#src/rest/modules/review/repositories/review-repository.interface.js';
import {ReviewEntity} from '#src/rest/modules/review/review.entity.js';
import {Review} from '#src/rest/modules/review/review.type.js';
import {Component} from '#src/types/component.enum.js';
import {DocumentType, Ref, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import mongoose from 'mongoose';

@injectable()
export class MongoReviewRepository implements ReviewRepository {
  constructor(
    @inject(Component.ReviewModel) private reviewModel: types.ModelType<ReviewEntity>,
  ) {
  }

  public async create(reviewData: Review): Promise<DocumentType<ReviewEntity>> {
    const createdReview = await this.reviewModel.create(reviewData);
    return createdReview.populate(['authorId', 'offerId']);
  }

  public async findById(reviewId: string): Promise<DocumentType<ReviewEntity> | null> {
    return this.reviewModel
      .findById(reviewId)
      .populate(['authorId', 'offerId']);
  }

  public async findByCommentAndDate(reviewComment: string, reviewPublishDate: Date): Promise<DocumentType<ReviewEntity> | null> {
    return this.reviewModel
      .findOne({comment: reviewComment, publishDate: reviewPublishDate})
      .populate(['authorId', 'offerId']);
  }

  public async findByOffer(offerId: string, effectiveLimit: number): Promise<DocumentType<ReviewEntity>[]> {
    return this.reviewModel
      .find({offerId}, {}, {limit: effectiveLimit})
      .sort({publishDate: -1})
      .populate(['authorId', 'offerId']);
  }

  public async exists(offerId: string): Promise<boolean> {
    return this.reviewModel.exists({_id: offerId}) !== null;
  }

  public async getAverageRatingByOfferId(offerIdRef: Ref<OfferEntity>): Promise<{
    _id: Ref<OfferEntity>;
    averageRating: number;
  }[]> {
    const objectId = new mongoose.Types.ObjectId(offerIdRef.toString());
    return this.reviewModel.aggregate([
      {
        $match: {offerId: objectId}
      },
      {
        $group: {
          _id: '$offerId',
          averageRating: {$avg: '$rating'},
        },
      },
    ]);
  }
}
