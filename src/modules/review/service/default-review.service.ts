import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {CreateReviewDto} from '#src/modules/review/dto/create-review.dto.js';
import {ReviewDTO} from '#src/modules/review/dto/review.dto.js';
import {ReviewRepository} from '#src/modules/review/repository/review-repository.interface.js';
import {ReviewEntity} from '#src/modules/review/review.entity.js';
import {ReviewService} from '#src/modules/review/service/review-service.interface.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {ListLimitsConfig} from '#src/rest/config.constant.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Component} from '#src/types/component.enum.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Ref} from '@typegoose/typegoose';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import mongoose from 'mongoose';

@injectable()
export class DefaultReviewService implements ReviewService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.ReviewRepository) private readonly reviewRepository: ReviewRepository,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
  }

  public async create(authorIdRef: Ref<UserEntity>, offerIdRef: Ref<OfferEntity>, reviewParams: CreateReviewDto): Promise<ReviewEntity> {
    const commentTrimmed = reviewParams.comment.trim();
    const existingReview = await this.reviewRepository.findByOfferAndComment(offerIdRef, commentTrimmed);
    if (existingReview) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `A review with the same text already exists for offer ID '${offerIdRef}'.`,
        'ReviewService'
      );
    }
    const reviewData: ReviewDTO = {
      ...reviewParams,
      publishDate: new Date(),
    };

    const reviewCreationResult = await this.createReviewInternal(authorIdRef, offerIdRef, reviewData);
    const createdReview = await this.findById(reviewCreationResult.id);
    if (!createdReview) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `An unknown error occurred error creating review for offer ID '${offerIdRef}' and user ID '${authorIdRef}.`,
        'ReviewService'
      );
    }

    return createdReview;
  }

  public async calculateAndSetRating(offerIdRef: Ref<OfferEntity>): Promise<boolean> {
    const aggregationResult = await this.reviewRepository.calculateAverageRating(offerIdRef);
    if (aggregationResult.length < 1) {
      this.logger.error(`Error get rating aggregation result for offer ID: '${offerIdRef.toString()}'`);
      return false;
    }

    const {averageRating} = aggregationResult[0];
    const isOfferRatingUpdated = await this.offerService.setRating(offerIdRef, averageRating);
    if (!isOfferRatingUpdated) {
      this.logger.error(`Can't update review count for offer ID '${offerIdRef.toString()}'`);
      return false;
    }

    return true;
  }

  public async findByOffer(offerId: string, requestedLimit?: number): Promise<ReviewEntity[]> {
    if (requestedLimit && requestedLimit > ListLimitsConfig.REVIEW_LIST_LIMIT) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The 'limit' parameter cannot exceed ${ListLimitsConfig.REVIEW_LIST_LIMIT}.`,
        'ReviewService'
      );
    }

    const effectiveLimit = Math.min(requestedLimit ?? Number.MAX_VALUE, ListLimitsConfig.REVIEW_LIST_LIMIT);
    const offerReviews = await this.reviewRepository.findByOffer(offerId, effectiveLimit);

    this.logger.info(`Completed search for reviews for offer '${offerId}'. Found ${offerReviews.length} reviews.`);
    return offerReviews;
  }

  public async findById(reviewId: string): Promise<ReviewEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return null;
    }

    return await this.reviewRepository.findById(reviewId);
  }

  public async exists(reviewId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return false;
    }

    const objectId = new mongoose.Types.ObjectId(reviewId);
    return this.reviewRepository.exists(objectId);
  }

  private async createReviewInternal(authorIdRef: Ref<UserEntity>, offerIdRef: Ref<OfferEntity>, reviewData: ReviewDTO): Promise<ReviewEntity> {
    try {
      const review = new ReviewEntity(authorIdRef, offerIdRef, reviewData);
      const createdReview = await this.reviewRepository.create(review);

      if (!await this.offerService.incrementReviewCount(offerIdRef)) {
        this.logger.error(`Can't update review count for offer ID '${offerIdRef}'`);
      }
      if (!await this.calculateAndSetRating(offerIdRef)) {
        this.logger.error(`Can't calculate rating for offer ID '${offerIdRef}'`);
      }

      this.logger.info(`New [review] with publish date '${review.publishDate}' created`);
      return createdReview;
    } catch (error) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error creating review for offer ID '${offerIdRef}' and user ID '${authorIdRef}. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`,
        'ReviewService'
      );
    }
  }
}
