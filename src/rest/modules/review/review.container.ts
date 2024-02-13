import {MongoReviewRepository} from '#src/rest/modules/review/repositories/mongo-review.repository.js';
import {ReviewRepository} from '#src/rest/modules/review/repositories/review-repository.interface.js';
import {ReviewEntity, ReviewModel} from '#src/rest/modules/review/review.entity.js';
import {DefaultReviewService} from '#src/rest/modules/review/services/default-review.service.js';
import {ReviewService} from '#src/rest/modules/review/services/review-service.interface.js';
import {Component} from '#src/types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createReviewContainer(): Container {
  const reviewContainer = new Container();
  reviewContainer.bind<types.ModelType<ReviewEntity>>(Component.ReviewModel).toConstantValue(ReviewModel);
  reviewContainer.bind<ReviewService>(Component.ReviewService).to(DefaultReviewService).inSingletonScope();
  reviewContainer.bind<ReviewRepository>(Component.ReviewRepository).to(MongoReviewRepository).inSingletonScope();

  return reviewContainer;
}
