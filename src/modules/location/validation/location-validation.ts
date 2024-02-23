import {LocationValidationMessage} from '#src/modules/location/validation/location-validation.message.js';
import {IsLatitude, IsLongitude} from 'class-validator';

export class LocationValidation {
  @IsLatitude({message: LocationValidationMessage.latitude.isLatitude})
  public latitude!: number;

  @IsLongitude({message: LocationValidationMessage.longitude.isLongitude})
  public longitude!: number;
}
