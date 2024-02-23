import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {ReviewRepository} from '#src/modules/review/repository/review-repository.interface.js';
import {ReviewEntity} from '#src/modules/review/review.entity.js';
import {ReviewService} from '#src/modules/review/service/review-service.interface.js';
import {Review} from '#src/modules/review/type/review.type.js';
import {UserService} from '#src/modules/user/service/user-service.interface.js';
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
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
  }

  public async create(offerId: string, reviewParams: Omit<Review, 'offer' | 'publishDate'>): Promise<ReviewEntity> {
    const commentTrimmed = reviewParams.comment.trim();
    const existingReview = await this.reviewRepository.findByOfferAndComment(offerId, commentTrimmed);
    if (existingReview) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Review with same text for offer ID '${offerId}' already exists.`,
        'ReviewService'
      );
    }

    const existedOffer = await this.offerService.findById(offerId);
    if (!existedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ID '${offerId}' not found.`,
        'ReviewService'
      );
    }

    // todo создание ревью
    const reviewData: Review = {
      ...reviewParams,
      offer: existedOffer,
      publishDate: new Date(),
    };
    return await this.createReviewInternal(reviewData);
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

  public async checkExists(reviewId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return false;
    }

    const objectId = new mongoose.Types.ObjectId(reviewId);
    return this.reviewRepository.exists(objectId);
  }

  private async createReviewInternal(reviewData: Review): Promise<ReviewEntity> {
    const {offer: offerData, author: authorData} = reviewData;

    const offerIdRef = await this.offerService.getIdRefByTitle(offerData.title);
    if (!offerIdRef) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer '${offerData.title}' not found`,
        'ReviewService'
      );
    }

    const authorIdRef = await this.userService.getIdRefByEmail(authorData.email);
    if (!authorIdRef) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Author '${authorData.email}' not found`,
        'ReviewService'
      );
    }

    const review = new ReviewEntity(reviewData, offerIdRef, authorIdRef);
    const createdReview = await this.reviewRepository.create(review);
    if (!createdReview || !review) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error creating review '${offerData.title}. An unknown error occurred.'}`,
        'ReviewService'
      );
    }

    const isOfferReviewCountUpdated = await this.offerService.incrementReviewCount(offerIdRef);
    if (!isOfferReviewCountUpdated) {
      this.logger.error(`Can't update review count for offer '${offerData.title}'`);
    }

    const isCalculateAndSetRating = await this.calculateAndSetRating(offerIdRef);
    if (!isCalculateAndSetRating) {
      this.logger.error(`Can't calculate rating for offer '${offerData.title}'`);
    }

    this.logger.info(`New [review] with publish date '${review.publishDate}' created`);
    return createdReview;
  }
}
