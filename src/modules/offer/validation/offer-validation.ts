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
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested
} from 'class-validator';


export class OfferValidation {
  @IsString()
  @Length(OFFERVALIDATIONCONSTANT.TITLE.MINLENGTH, OFFERVALIDATIONCONSTANT.TITLE.MAXLENGTH)
  public title!: string;

  @IsString()
  @Length(OFFERVALIDATIONCONSTANT.description.MINLENGTH, OFFERVALIDATIONCONSTANT.description.MAXLENGTH)
  public description!: string;

  @IsDateString()
  public publishDate!: Date;

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

  @IsBoolean()
  public isFavorite!: boolean;

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

  @IsNumber({maxDecimalPlaces: 1})
  @Min(1)
  @Max(5)
  public rating!: number;

  @ValidateNested()
  @Type(() => UserValidation)
  public host!: User;

  @ValidateNested()
  @Type(() => LocationValidation)
  public location!: Location;
}
