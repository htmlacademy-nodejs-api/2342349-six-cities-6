import {Citi} from '#src/utils/modules/city/citi.type.js';
import {CityEntity} from '#src/utils/modules/city/city.entity.js';
import {LocationEntity} from '#src/utils/modules/location/location.entity.js';
import {Location} from '#src/utils/modules/location/location.type.js';
import {Offer, OfferType} from '#src/utils/modules/offer/offer.type.js';
import {UserEntity} from '#src/utils/modules/user/user.entity.js';
import {User} from '#src/utils/modules/user/user.type.js';
import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps implements Offer {
  @prop({required: true, unique: true, type: String})
  public title: string;

  @prop({required: true, enum: OfferType, type: String})
  public type: OfferType;

  @prop({required: true, type: Number})
  public bedroom: number;

  @prop({required: true, ref: CityEntity})
  public cityId: Ref<CityEntity>;

  public city: Citi;

  @prop({required: true, type: String})
  public description: string;

  @prop({type: () => [String], required: true, default: []})
  public goods2: mongoose.Types.Array<string>;

  public goods: string[];

  @prop({required: true, ref: UserEntity})
  public hostId: Ref<UserEntity>;

  public host: User;

  // @prop({ required: true, type: () => [String], default: [] })
  public images: string[];

  @prop({required: true, type: Boolean})
  public isFavorite: boolean;

  @prop({required: true, type: Boolean})
  public isPremium: boolean;

  @prop({required: true, ref: LocationEntity})
  public locationId: Ref<LocationEntity>;

  public location: Location;

  @prop({required: true, type: String})
  public previewImage: string;

  @prop({required: true, type: Number})
  public price: number;

  @prop({required: true, type: Date})
  public publicDate: Date;

  @prop({required: true, type: Number})
  public rating: number;

  @prop({required: true, type: Number})
  public room: number;

  constructor(
    offerData: Offer,
    cityId: Ref<CityEntity>,
    hostId: Ref<UserEntity>,
    locationId: Ref<LocationEntity>
  ) {
    super();
    this.bedroom = offerData.bedroom;
    this.city = offerData.city;
    this.description = offerData.description;
    this.goods = offerData.goods;
    this.goods2 = offerData.goods as mongoose.Types.Array<string>;
    console.log('1');
    console.log(this.goods2);
    console.log(Array.isArray(this.goods2));
    this.host = offerData.host;
    this.images = offerData.images;
    this.isFavorite = offerData.isFavorite;
    this.isPremium = offerData.isPremium;
    this.location = offerData.location;
    this.previewImage = offerData.previewImage;
    this.price = offerData.price;
    this.publicDate = offerData.publicDate;
    this.rating = offerData.rating;
    this.room = offerData.room;
    this.title = offerData.title;
    this.type = offerData.type;
    this.cityId = cityId;
    this.hostId = hostId;
    this.locationId = locationId;
  }
}

export const OfferModel = getModelForClass(OfferEntity);
