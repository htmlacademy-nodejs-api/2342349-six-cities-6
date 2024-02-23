import {City} from '#src/modules/city/type/city.type.js';
import {CityValidation} from '#src/modules/city/validation/city-validation.js';
import {LocationValidation} from '#src/modules/location/validation/location-validation.js';
import {OfferType} from '#src/modules/offer/type/offer.type.js';
import {OfferValidationConstant} from '#src/modules/offer/validation/offer-validation.constant.js';
import {OfferValidationMessage} from '#src/modules/offer/validation/offer-validation.message.js';
import {User} from '#src/modules/user/type/user.type.js';
import {UserValidation} from '#src/modules/user/validation/user-validation.js';
import {Location} from '#src/types/location.type.js';
import {Type} from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested
} from 'class-validator';

export class CreateOfferDto {
  @IsString({message: OfferValidationMessage.title.isString})
  @Length(OfferValidationConstant.title.minLength, OfferValidationConstant.title.maxLength, {message: OfferValidationMessage.title.length})
  public title!: string;

  @IsString({message: OfferValidationMessage.description.isString})
  @Length(OfferValidationConstant.description.minLength, OfferValidationConstant.description.maxLength, {message: OfferValidationMessage.description.length})
  public description!: string;

  @IsDateString({}, {message: OfferValidationMessage.publicDate.isDateString})
  public publicDate!: Date;

  @ValidateNested()
  @Type(() => CityValidation)
  public city!: City;

  @IsUrl({}, {message: OfferValidationMessage.previewImage.isUrl})
  public previewImage!: string;

  @IsArray({message: OfferValidationMessage.images.isArray})
  @ArrayMinSize(OfferValidationConstant.images.minCount, {message: OfferValidationMessage.images.arrayMinSize})
  @ArrayMaxSize(OfferValidationConstant.images.maxCount, {message: OfferValidationMessage.images.arrayMaxSize})
  @IsUrl({}, {each: true, message: OfferValidationMessage.images.isUrl})
  public images!: string[];

  @IsBoolean({message: OfferValidationMessage.isPremium.isBoolean})
  public isPremium!: boolean;

  @IsEnum(OfferType, {message: OfferValidationMessage.type.isEnum})
  public type!: OfferType;

  @IsNumber({}, {message: OfferValidationMessage.room.isNumber})
  @Min(OfferValidationConstant.room.min, {message: OfferValidationMessage.room.min})
  @Max(OfferValidationConstant.room.max, {message: OfferValidationMessage.room.max})
  public room!: number;

  @IsNumber({}, {message: OfferValidationMessage.bedroom.isNumber})
  @Min(OfferValidationConstant.bedroom.min, {message: OfferValidationMessage.bedroom.min})
  @Max(OfferValidationConstant.bedroom.max, {message: OfferValidationMessage.bedroom.max})
  public bedroom!: number;

  @IsNumber({}, {message: OfferValidationMessage.price.isNumber})
  @Min(OfferValidationConstant.price.min, {message: OfferValidationMessage.price.min})
  @Max(OfferValidationConstant.price.max, {message: OfferValidationMessage.price.max})
  public price!: number;

  @IsArray({message: OfferValidationMessage.goods.isArray})
  @IsString({each: true, message: OfferValidationMessage.goods.isString})
  public goods!: string[];

  @ValidateNested()
  @Type(() => UserValidation)
  public host!: User;

  @ValidateNested()
  @Type(() => LocationValidation)
  public location!: Location;
}
