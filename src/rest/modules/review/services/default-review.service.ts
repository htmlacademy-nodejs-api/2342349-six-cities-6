import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {OfferService} from '#src/rest/modules/offer/services/offer-service.interface.js';
import {ReviewRepository} from '#src/rest/modules/review/repositories/review-repository.interface.js';
import {ReviewEntity} from '#src/rest/modules/review/review.entity.js';
import {Review} from '#src/rest/modules/review/review.type.js';
import {ReviewService} from '#src/rest/modules/review/services/review-service.interface.js';
import {UserService} from '#src/rest/modules/user/services/user-service.interface.js';
import {Component} from '#src/types/component.enum.js';
import {EntityConfig} from '#src/utils/config.constants.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Ref} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

@injectable()
export class DefaultReviewService implements ReviewService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.ReviewRepository) private readonly reviewRepository: ReviewRepository,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
  }

  public async findOrCreate(reviewData: Review): Promise<ReviewEntity | null> {
    const {comment, publishDate} = reviewData;
    const commentTrimmed = comment.trim();
    const existingReview = await this.reviewRepository.findByCommentAndDate(commentTrimmed, publishDate);

    return existingReview ?? await this.createReviewInternal(reviewData);
  }

  public async findByOffer(offerId: string, requestedLimit?: number): Promise<ReviewEntity[]> {
    const effectiveLimit = Math.min(requestedLimit ?? Number.MAX_VALUE, EntityConfig.REVIEW_LIST_LIMIT);
    return this.reviewRepository.findByOffer(offerId, effectiveLimit);
  }

  public async calculateAndSetOfferRating(offerIdRef: Ref<OfferEntity>): Promise<boolean> {
    const aggregationResult = await this.reviewRepository.getAverageRatingByOfferId(offerIdRef);
    if (aggregationResult.length < 1) {
      this.logger.error('Error get rating aggregation result for offer');
      return false;
    }

    const {averageRating} = aggregationResult[0];
    const isOfferRatingUpdated = await this.offerService.setOfferAverageRating(offerIdRef, averageRating);
    if (!isOfferRatingUpdated) {
      this.logger.error(`Can't update review count for offer id '${offerIdRef}'`);
      return false;
    }

    return true;
  }

  private async createReviewInternal(reviewData: Review): Promise<ReviewEntity | null> {
    try {
      const {offer: offerData, author: authorData} = reviewData;

      const offerIdRef = await this.offerService.getIdRefByTitle(offerData.title);
      if (!offerIdRef) {
        this.logger.error(`Offer '${offerData.title}' not found`);
        return null;
      }

      const authorIdRef = await this.userService.getIdRefByMail(authorData.email);
      if (!authorIdRef) {
        this.logger.error(`Author '${authorData.email}' not found`);
        return null;
      }

      const review = new ReviewEntity(reviewData, offerIdRef, authorIdRef);
      const createdReview = await this.reviewRepository.create(review);
      this.logger.info(`New [review] with publish date '${review.publishDate}' created`);

      const isOfferReviewCountUpdated = await this.offerService.incrementOfferReviewCount(offerIdRef);
      if (!isOfferReviewCountUpdated) {
        this.logger.error(`Can't update review count for offer '${offerData.title}'`);
      }

      const isCalculateAndSetRating = await this.calculateAndSetOfferRating(offerIdRef);
      if (!isCalculateAndSetRating) {
        this.logger.error(`Can't calculate rating for offer '${offerData.title}'`);
      }

      return createdReview.populate(['authorId', 'offerId']);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error creating review with publish date ${reviewData.publishDate}. `, error);
      } else {
        this.logger.error(`Error creating review with publish date ${reviewData.publishDate}. An unknown error.`);
      }
      return null;
    }
  }
}
