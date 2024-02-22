import {CityEntity} from '#src/rest/modules/city/city.entity.js';
import {City} from '#src/rest/modules/city/type/city.type.js';
import {Offer, OfferType} from '#src/rest/modules/offer/type/offer.type.js';
import {GeoLocation} from '#src/rest/modules/schemas/geo.schema.js';
import {User} from '#src/rest/modules/user/type/user.type.js';
import {UserEntity} from '#src/rest/modules/user/user.entity.js';
import {Location} from '#src/types/location.type.js';
import {defaultClasses, getModelForClass, modelOptions, prop, Ref, Severity} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps implements Offer {
  @prop({required: true, trim: true, unique: true})
  public title: string;

  @prop({required: true, enum: OfferType})
  public type: OfferType;

  @prop({required: true})
  public bedroom: number;

  @prop({required: true, ref: CityEntity})
  public cityId: Ref<CityEntity>;

  public city: City;

  @prop({required: true, trim: true})
  public description: string;

  @prop({required: true, type: [String]})
  public goods: string[];

  @prop({required: true, ref: UserEntity})
  public hostId: Ref<UserEntity>;

  public host: User;

  @prop({required: true, type: [String]})
  public images: string[];

  @prop({required: true})
  public isPremium: boolean;

  isFavorite: boolean = false;

  @prop({required: true})
  public geoLocation: GeoLocation;

  public location: Location;

  @prop({required: true})
  public previewImage: string;

  @prop({required: true})
  public price: number;

  @prop({required: true})
  public publicDate: Date;

  @prop({required: true})
  public room: number;

  @prop({required: true})
  public rating: number = 0;

  @prop({required: true})
  public reviewCount: number = 0;

  constructor(
    offerData: Offer,
    cityId: Ref<CityEntity>,
    hostId: Ref<UserEntity>,
  ) {
    super();
    this.bedroom = offerData.bedroom;
    this.city = offerData.city;
    this.description = offerData.description;
    this.goods = offerData.goods;
    this.host = offerData.host;
    this.images = offerData.images;
    this.isPremium = offerData.isPremium;
    this.location = offerData.location;
    this.previewImage = offerData.previewImage;
    this.price = offerData.price;
    this.publicDate = offerData.publicDate;
    this.room = offerData.room;
    this.title = offerData.title;
    this.type = offerData.type;
    this.cityId = cityId;
    this.hostId = hostId;
    this.geoLocation = {
      type: 'Point',
      coordinates: [offerData.location.longitude, offerData.location.latitude]
    };
  }
}

export const OfferModel = getModelForClass(OfferEntity);
