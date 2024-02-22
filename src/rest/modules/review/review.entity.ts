import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {Offer} from '#src/rest/modules/offer/type/offer.type.js';
import {Review} from '#src/rest/modules/review/type/review.type.js';
import {User} from '#src/rest/modules/user/type/user.type.js';
import {UserEntity} from '#src/rest/modules/user/user.entity.js';
import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';

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
  @prop({required: true, ref: UserEntity})
  public authorId: Ref<UserEntity>;

  public author: User;

  @prop({required: true, ref: OfferEntity})
  public offerId: Ref<OfferEntity>;

  public offer: Offer;

  @prop({required: true, trim: true})
  public comment: string;

  @prop({required: true})
  public publishDate: Date;

  @prop({required: true})
  public rating: number;

  constructor(
    reviewData: Review,
    offerId: Ref<OfferEntity>,
    authorId: Ref<UserEntity>,
  ) {
    super();
    this.author = reviewData.author;
    this.offer = reviewData.offer;
    this.comment = reviewData.comment;
    this.publishDate = reviewData.publishDate;
    this.rating = reviewData.rating;
    this.authorId = authorId;
    this.offerId = offerId;
  }
}

export const ReviewModel = getModelForClass(ReviewEntity);
