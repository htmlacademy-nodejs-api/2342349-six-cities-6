import {City} from '#src/modules/city/type/city.type.js';
import {CityValidation} from '#src/modules/city/validation/city-validation.js';
import {LocationValidation} from '#src/modules/location/validation/location-validation.js';
import {OfferType} from '#src/modules/offer/type/offer.type.js';
import {OFFER_VALIDATION_CONSTANT} from '#src/modules/offer/validation/offer-validation.constant.js';
import {User} from '#src/modules/user/type/user.type.js';
import {UserValidation} from '#src/modules/user/validation/user-validation.js';
import {Location} from '#src/type/location.type.js';
import {Type} from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested
} from 'class-validator';

export class UpdateOfferDTO {
  @IsOptional()
  @IsString()
  @Length(OFFER_VALIDATION_CONSTANT.TITLE.MIN_LENGTH, OFFER_VALIDATION_CONSTANT.TITLE.MAX_LENGTH)
  public title?: string;

  @IsOptional()
  @IsString()
  @Length(OFFER_VALIDATION_CONSTANT.description.MIN_LENGTH, OFFER_VALIDATION_CONSTANT.description.MAX_LENGTH)
  public description?: string;

  @IsOptional()
  @IsDateString()
  public publishDate?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => CityValidation)
  public city?: City;

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(OfferType)
  public type?: OfferType;

  @IsOptional()
  @IsNumber()
  @Min(OFFER_VALIDATION_CONSTANT.ROOM.MIN)
  @Max(OFFER_VALIDATION_CONSTANT.ROOM.MAX)
  public room?: number;

  @IsOptional()
  @IsNumber()
  @Min(OFFER_VALIDATION_CONSTANT.BEDROOM.MIN)
  @Max(OFFER_VALIDATION_CONSTANT.BEDROOM.MAX)
  public bedroom?: number;

  @IsOptional()
  @IsNumber()
  @Min(OFFER_VALIDATION_CONSTANT.PRICE.MIN)
  @Max(OFFER_VALIDATION_CONSTANT.PRICE.MAX)
  public price?: number;

  @IsOptional()
  @IsArray()
  @IsString({each: true})
  public goods?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UserValidation)
  public host?: User;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationValidation)
  public location?: Location;
}

