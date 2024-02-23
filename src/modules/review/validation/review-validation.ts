import {OfferValidation} from '#src/modules/offer/validation/offer-validation.js';
import {ReviewValidationConstant} from '#src/modules/review/validation/review-validation.constant.js';
import {ReviewValidationMessage} from '#src/modules/review/validation/review-validation.message.js';
import {UserValidation} from '#src/modules/user/validation/user-validation.js';
import {Type} from 'class-transformer';
import {IsNumber, IsString, Length, Max, Min, ValidateNested} from 'class-validator';

export class ReviewValidation {
  @ValidateNested()
  @Type(() => UserValidation)
  public author!: UserValidation;

  @IsString({message: ReviewValidationMessage.comment.isString})
  @Length(ReviewValidationConstant.comment.minLength, ReviewValidationConstant.comment.maxLength, {message: ReviewValidationMessage.comment.length})
  public comment!: string;

  @ValidateNested()
  @Type(() => OfferValidation)
  public offer!: OfferValidation;

  @IsNumber({}, {message: ReviewValidationMessage.rating.isNumber})
  @Min(ReviewValidationConstant.rating.min, {message: ReviewValidationMessage.rating.min})
  @Max(ReviewValidationConstant.rating.max, {message: ReviewValidationMessage.rating.max})
  public rating!: number;
}
