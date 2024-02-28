import {OfferValidation} from '#src/modules/offer/validation/offer-validation.js';
import {REVIEWVALIDATIONCONSTANT} from '#src/modules/review/validation/review-validation.constant.js';
import {UserValidation} from '#src/modules/user/validation/user-validation.js';
import {Type} from 'class-transformer';
import {IsNumber, IsString, Length, Max, Min, ValidateNested} from 'class-validator';

export class ReviewValidation {
  @ValidateNested()
  @Type(() => UserValidation)
  public author!: UserValidation;

  @IsString()
  @Length(REVIEWVALIDATIONCONSTANT.COMMENT.MINLENGTH, REVIEWVALIDATIONCONSTANT.COMMENT.MAXLENGTH)
  public comment!: string;

  @ValidateNested()
  @Type(() => OfferValidation)
  public offer!: OfferValidation;

  @IsNumber()
  @Min(REVIEWVALIDATIONCONSTANT.RATING.MIN)
  @Max(REVIEWVALIDATIONCONSTANT.RATING.MAX)
  public rating!: number;
}
