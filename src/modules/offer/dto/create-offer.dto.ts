import {City} from '#src/modules/city/type/city.type.js';
import {CityValidation} from '#src/modules/city/validation/city-validation.js';
import {LocationValidation} from '#src/modules/location/validation/location-validation.js';
import {OfferType} from '#src/modules/offer/type/offer.type.js';
import {OFFERVALIDATIONCONSTANT} from '#src/modules/offer/validation/offer-validation.constant.js';
import {Location} from '#src/type/location.type.js';
import {Type} from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested
} from 'class-validator';

export class CreateOfferDTO {
  @IsString()
  @Length(OFFERVALIDATIONCONSTANT.TITLE.MINLENGTH, OFFERVALIDATIONCONSTANT.TITLE.MAXLENGTH)
  public title!: string;

  @IsString()
  @Length(OFFERVALIDATIONCONSTANT.description.MINLENGTH, OFFERVALIDATIONCONSTANT.description.MAXLENGTH)
  public description!: string;

  @ValidateNested()
  @Type(() => CityValidation)
  public city!: City;

  @IsUrl()
  public previewImage!: string;

  @IsArray()
  @ArrayMinSize(OFFERVALIDATIONCONSTANT.IMAGES.MINCOUNT)
  @ArrayMaxSize(OFFERVALIDATIONCONSTANT.IMAGES.MAXCOUNT)
  @IsUrl({}, {each: true})
  public images!: string[];

  @IsBoolean()
  public isPremium!: boolean;

  @IsEnum(OfferType)
  public type!: OfferType;

  @IsNumber()
  @Min(OFFERVALIDATIONCONSTANT.ROOM.MIN)
  @Max(OFFERVALIDATIONCONSTANT.ROOM.MAX)
  public room!: number;

  @IsNumber()
  @Min(OFFERVALIDATIONCONSTANT.BEDROOM.MIN)
  @Max(OFFERVALIDATIONCONSTANT.BEDROOM.MAX)
  public bedroom!: number;

  @IsNumber()
  @Min(OFFERVALIDATIONCONSTANT.PRICE.MIN)
  @Max(OFFERVALIDATIONCONSTANT.PRICE.MAX)
  public price!: number;

  @IsArray()
  @IsString({each: true})
  public goods!: string[];

  @ValidateNested()
  @Type(() => LocationValidation)
  public location!: Location;
}
