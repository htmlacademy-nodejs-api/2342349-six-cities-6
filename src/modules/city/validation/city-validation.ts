import {CityValidationConstant} from '#src/modules/city/validation/city-validation.constant.js';
import {CityValidationMessage} from '#src/modules/city/validation/city-validation.message.js';
import {LocationValidation} from '#src/modules/location/validation/location-validation.js';
import {Type} from 'class-transformer';
import {IsString, Length, ValidateNested} from 'class-validator';

export class CityValidation {
  @IsString({message: CityValidationMessage.name.isString})
  @Length(CityValidationConstant.name.minLength, CityValidationConstant.name.maxLength, {message: CityValidationMessage.name.length})
  public name!: string;

  @ValidateNested()
  @Type(() => LocationValidation)
  public location!: LocationValidation;
}
