import {City} from '#src/modules/city/type/city.type.js';
import {CityValidation} from '#src/modules/city/validation/city-validation.js';
import {LocationValidation} from '#src/modules/location/validation/location-validation.js';
import {OfferType} from '#src/modules/offer/type/offer.type.js';
import {OFFERVALIDATIONCONSTANT} from '#src/modules/offer/validation/offer-validation.constant.js';
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
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested
} from 'class-validator';

export class UpdateOfferDTO {
  @IsOptional()
  @IsString()
  @Length(OFFERVALIDATIONCONSTANT.TITLE.MINLENGTH, OFFERVALIDATIONCONSTANT.TITLE.MAXLENGTH)
  public title?: string;

  @IsOptional()
  @IsString()
  @Length(OFFERVALIDATIONCONSTANT.description.MINLENGTH, OFFERVALIDATIONCONSTANT.description.MAXLENGTH)
  public description?: string;

  @IsOptional()
  @IsDateString()
  public publishDate?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => CityValidation)
  public city?: City;

  @IsOptional()
  @IsUrl()
  public previewImage?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(OFFERVALIDATIONCONSTANT.IMAGES.MINCOUNT)
  @ArrayMaxSize(OFFERVALIDATIONCONSTANT.IMAGES.MAXCOUNT)
  @IsUrl({}, {each: true})
  public images?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(OfferType)
  public type?: OfferType;

  @IsOptional()
  @IsNumber()
  @Min(OFFERVALIDATIONCONSTANT.ROOM.MIN)
  @Max(OFFERVALIDATIONCONSTANT.ROOM.MAX)
  public room?: number;

  @IsOptional()
  @IsNumber()
  @Min(OFFERVALIDATIONCONSTANT.BEDROOM.MIN)
  @Max(OFFERVALIDATIONCONSTANT.BEDROOM.MAX)
  public bedroom?: number;

  @IsOptional()
  @IsNumber()
  @Min(OFFERVALIDATIONCONSTANT.PRICE.MIN)
  @Max(OFFERVALIDATIONCONSTANT.PRICE.MAX)
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

