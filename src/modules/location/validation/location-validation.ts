import {LocationValidationConstant} from '#src/modules/location/validation/location-validation.constant.js';
import {LocationValidationMessage} from '#src/modules/location/validation/location-validation.message.js';
import {IsNumber, Max, Min} from 'class-validator';

export class LocationValidation {
  @IsNumber({}, {message: LocationValidationMessage.latitude.isNumber})
  @Min(LocationValidationConstant.latitude.min, {message: LocationValidationMessage.latitude.min})
  @Max(LocationValidationConstant.latitude.max, {message: LocationValidationMessage.latitude.max})
  public latitude!: number;

  @IsNumber({}, {message: LocationValidationMessage.longitude.isNumber})
  @Min(LocationValidationConstant.longitude.min, {message: LocationValidationMessage.longitude.min})
  @Max(LocationValidationConstant.longitude.max, {message: LocationValidationMessage.longitude.max})
  public longitude!: number;
}
