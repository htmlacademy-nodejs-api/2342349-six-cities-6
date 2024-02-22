import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {ReviewRepository} from '#src/modules/review/repository/review-repository.interface.js';
import {ReviewEntity} from '#src/modules/review/review.entity.js';
import {Review} from '#src/modules/review/type/review.type.js';
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

  public async create(reviewData: Review): Promise<boolean> {
    const createdReview = await this.reviewModel.create(reviewData);
    return !!createdReview;
  }

  public async findById(reviewId: string): Promise<DocumentType<ReviewEntity> | null> {
    return this.reviewModel
      .findById(reviewId)
      .populate({
        path: 'offerId',
        populate: [
          {
            path: 'hostId',
            model: 'UserEntity'
          },
          {
            path: 'cityId',
            model: 'CityEntity'
          }
        ]
      })
      .populate('authorId');
  }

  public async findByComment(offerId: string, reviewComment: string): Promise<DocumentType<ReviewEntity> | null> {
    return this.reviewModel
      .findOne({
        offerId: offerId,
        comment: reviewComment,
      })
      .populate(['authorId', 'offerId']);
  }

  public async findByOffer(offerId: string, effectiveLimit: number): Promise<DocumentType<ReviewEntity>[]> {
    return this.reviewModel
      .find({offerId}, {}, {limit: effectiveLimit})
      .sort({publishDate: -1})
      .populate({
        path: 'offerId',
        populate: [
          {
            path: 'hostId',
            model: 'UserEntity'
          },
          {
            path: 'cityId',
            model: 'CityEntity'
          }
        ]
      })
      .populate('authorId');
  }

  public async exists(reviewId: mongoose.Types.ObjectId): Promise<boolean> {
    const isReviewExists = await this.reviewModel.exists({_id: reviewId});
    return !!isReviewExists;
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
