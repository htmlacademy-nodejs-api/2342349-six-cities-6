import {ReviewValidationConstant} from '#src/modules/review/validation/review-validation.constant.js';
import {ReviewValidationMessage} from '#src/modules/review/validation/review-validation.message.js';
import {IsNumber, IsString, Length, Max, Min} from 'class-validator';

export class CreateReviewDto {
  @IsString({message: ReviewValidationMessage.comment.isString})
  @Length(ReviewValidationConstant.comment.minLength, ReviewValidationConstant.comment.maxLength, {message: ReviewValidationMessage.comment.length})
  public comment!: string;

  @IsNumber({}, {message: ReviewValidationMessage.rating.isNumber})
  @Min(ReviewValidationConstant.rating.min, {message: ReviewValidationMessage.rating.min})
  @Max(ReviewValidationConstant.rating.max, {message: ReviewValidationMessage.rating.max})
  public rating!: number;
}
