import {Review} from '#src/utils/modules/review/review.type.js';
import {UserEntity} from '#src/utils/modules/user/user.entity.js';
import {User} from '#src/utils/modules/user/user.type.js';
import {defaultClasses, getModelForClass, modelOptions, prop} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ReviewEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'reviews',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ReviewEntity extends defaultClasses.TimeStamps implements Review {
  @prop({required: true, type: UserEntity})
  public author: User;

  @prop({required: true, trim: true, type: String})
  public comment: string;

  @prop({required: true, type: Date})
  public publishDate: Date;

  @prop({required: true, type: Number})
  public rating: number;

  constructor(reviewData: Review) {
    super();
    this.author = reviewData.author;
    this.comment = reviewData.comment;
    this.publishDate = reviewData.publishDate;
    this.rating = reviewData.rating;
  }
}

export const ReviewModel = getModelForClass(ReviewEntity);
