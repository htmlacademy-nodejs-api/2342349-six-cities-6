import {CITYVALIDATIONCONSTANT} from '#src/modules/city/validation/city-validation.constant.js';
import {LocationValidation} from '#src/modules/location/validation/location-validation.js';
import {Type} from 'class-transformer';
import {IsString, Length, ValidateNested} from 'class-validator';

export class CityValidation {
  @IsString()
  @Length(CITYVALIDATIONCONSTANT.NAME.MINLENGTH, CITYVALIDATIONCONSTANT.NAME.MAXLENGTH)
  public name!: string;

  @ValidateNested()
  @Type(() => LocationValidation)
  public location!: LocationValidation;
}
