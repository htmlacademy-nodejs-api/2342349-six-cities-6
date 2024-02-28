import {REVIEWVALIDATIONCONSTANT} from '#src/modules/review/validation/review-validation.constant.js';
import {IsNumber, IsString, Length, Max, Min} from 'class-validator';

export class CreateReviewDTO {
  @IsString()
  @Length(REVIEWVALIDATIONCONSTANT.COMMENT.MINLENGTH, REVIEWVALIDATIONCONSTANT.COMMENT.MAXLENGTH)
  public comment!: string;

  @IsNumber()
  @Min(REVIEWVALIDATIONCONSTANT.RATING.MIN)
  @Max(REVIEWVALIDATIONCONSTANT.RATING.MAX)
  public rating!: number;
}
