import {CityService} from '#src/rest/modules/city/city-service.interface.js';
import {LocationService} from '#src/rest/modules/location/location-service.interface.js';
import {OfferService} from '#src/rest/modules/offer/offer-service.interface.js';
import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {Offer} from '#src/rest/modules/offer/offer.type.js';
import {UserService} from '#src/rest/modules/user/user-service.interface.js';
import {Component} from '#src/types/component.enum.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.LocationService) private readonly locationService: LocationService,
    @inject(Component.CityService) private readonly cityService: CityService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
  }

  public async findById(offerId: number): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId);
  }

  public async findByTitle(offerTitle: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOne({title: offerTitle});
  }

  public async fineOrCreate(offerData: Offer): Promise<DocumentType<OfferEntity>> {
    const existedOffer = await this.findByTitle(offerData.title);
    if (existedOffer) {
      return existedOffer;
    }
    return this.create(offerData);
  }

  private async create(offerData: Offer): Promise<DocumentType<OfferEntity>> {
    const {city: offerCityData, host: offerUserData, location: offerLocationData} = offerData;
    const offerCity = await this.cityService.fineOrCreate(offerCityData);
    const offerUser = await this.userService.findOrCreate(offerUserData);
    const offerLocation = await this.locationService.fineOrCreate(offerLocationData);

    const offer = new OfferEntity(offerData, offerCity.id, offerUser.id, offerLocation.id);
    const result = await this.offerModel.create(offer);
    this.logger.info(`New offer created: ${offer.title}`);

    return result;
  }

}
