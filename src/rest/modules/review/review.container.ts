import {DefaultReviewService} from '#src/rest/modules/review/default-review.service.js';
import {ReviewService} from '#src/rest/modules/review/review-service.interface.js';
import {ReviewEntity, ReviewModel} from '#src/rest/modules/review/review.entity.js';
import {Component} from '#src/types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createReviewContainer(): Container {
  const reviewContainer = new Container();
  reviewContainer.bind<types.ModelType<ReviewEntity>>(Component.ReviewModel).toConstantValue(ReviewModel);
  reviewContainer.bind<ReviewService>(Component.ReviewService).to(DefaultReviewService).inSingletonScope();

  return reviewContainer;
}
