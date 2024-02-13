import {CityService} from '#src/rest/modules/city/services/city-service.interface.js';
import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {Offer} from '#src/rest/modules/offer/offer.type.js';
import {OfferRepository} from '#src/rest/modules/offer/repositories/offer-repository.interface.js';
import {OfferService} from '#src/rest/modules/offer/services/offer-service.interface.js';
import {UserService} from '#src/rest/modules/user/services/user-service.interface.js';
import {Component} from '#src/types/component.enum.js';
import {EntityConfig} from '#src/utils/config.constants.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Ref} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferRepository) private readonly offerRepository: OfferRepository,
    @inject(Component.CityService) private readonly cityService: CityService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
  }

  public async findOrCreate(offerData: Offer): Promise<Offer | null> {
    const offerTitleTrimmed = offerData.title.trim();
    const existedOffer = await this.offerRepository.findByTitle(offerTitleTrimmed);

    return existedOffer ?? await this.createOfferInternal(offerData);
  }

  public async getIdRefByTitle(offerTitle: string): Promise<Ref<OfferEntity> | null> {
    const offerTitleTrimmed = offerTitle.trim();
    const foundOffer = await this.offerRepository.findByTitle(offerTitleTrimmed);

    return foundOffer?.id ?? null;
  }

  public async findPremiumByCity(cityId: string, requestedLimit?: number): Promise<OfferEntity[]> {
    const effectiveLimit = Math.min(requestedLimit ?? Number.MAX_VALUE, EntityConfig.PREMIUM_LIST_LIMIT);
    const premiumCityOffers = await this.offerRepository.findPremiumByCity(cityId, effectiveLimit);

    this.logger.info(`Completed search for premium offers in city '${cityId}'. Found ${premiumCityOffers.length} offers.`);
    return premiumCityOffers;
  }

  public async findFavoriteByUser(userId: string): Promise<Offer[] | null> {
    const favoriteOfferIds = await this.userService.getFavoriteOffer(userId);
    if (!favoriteOfferIds) {
      this.logger.error(`Can't get favorite list for user id '${userId}'`);
      return null;
    }

    const effectiveLimit = EntityConfig.FAVORITE_LIST_LIMIT;
    const userFavoriteOffers = await this.offerRepository.findFavoriteByUser(favoriteOfferIds, effectiveLimit);
    const offersWithFavoriteStatus = userFavoriteOffers.map((offer) => ({
      ...offer,
      isFavorite: true,
    }));

    this.logger.info(`Found ${userFavoriteOffers.length} favorite offers for user '${userId}'.`);
    return offersWithFavoriteStatus;
  }

  public async addFavoriteByUser(userId: string, offerId: string): Promise<Offer[] | null> {
    const isOfferExist = await this.offerRepository.exists(offerId);
    if (!isOfferExist) {
      this.logger.error(`Offer id '${offerId}' not found`);
      return null;
    }

    const isFavoriteAdded = await this.userService.addFavoriteOffer(userId, offerId);
    if (!isFavoriteAdded) {
      this.logger.error(`Can't add favorite to user id '${userId}'`);
      return null;
    }

    this.logger.info(`Offer '${offerId}' successfully added to favorites for user '${userId}'`);
    return this.findFavoriteByUser(userId);
  }

  public async deleteFavoriteByUser(userId: string, offerId: string): Promise<Offer[] | null> {
    const isOfferExist = await this.offerRepository.exists(offerId);
    if (!isOfferExist) {
      this.logger.error(`Offer id '${offerId}' not found`);
      return null;
    }

    const isFavoriteDeleted = await this.userService.deleteFavoriteOffer(userId, offerId);
    if (!isFavoriteDeleted) {
      this.logger.error(`Can't delete favorite to user id '${userId}'`);
      return null;
    }

    this.logger.info(`Offer '${offerId}' successfully removed from favorites for user '${userId}'`);
    return this.findFavoriteByUser(userId);
  }

  public async findByCity(cityId: string, requestedLimit?: number): Promise<OfferEntity[]> {
    const effectiveLimit = Math.min(requestedLimit ?? Number.MAX_VALUE, EntityConfig.OFFERS_LIST_LIMIT);
    const cityOffers = await this.offerRepository.findByCity(cityId, effectiveLimit);

    this.logger.info(`Completed search for offers in city '${cityId}'. Found ${cityOffers.length} offers.`);
    return cityOffers;
  }

  public async findOffersByCityWithFavoriteStatus(cityId: string, userId: string, requestedLimit?: number): Promise<OfferEntity[]> {
    const offersByCity = await this.findByCity(cityId, requestedLimit);

    const favoriteOfferIds = await this.userService.getFavoriteOffer(userId);
    if (!favoriteOfferIds) {
      this.logger.error(`Can't get favorite list for user id '${userId}'`);
      return offersByCity;
    }

    const offersWithFavoriteFlag = offersByCity.map((offer) => ({
      ...offer,
      isFavorite: favoriteOfferIds.includes(offer.id.toString()),
    }));

    this.logger.info(`Completed search for offers in city '${cityId}' with favorite status. Found ${offersWithFavoriteFlag.length} offers.`);
    return offersWithFavoriteFlag;
  }

  public async incrementOfferReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean | null> {
    this.logger.info(`Attempting to increment review count for offer with ID: '${offerIdRef.toString()}'`);
    return this.offerRepository.incrementReviewCount(offerIdRef);
  }

  public async setOfferAverageRating(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean | null> {
    const roundedRating = Number(averageRating.toFixed(2));
    this.logger.info(`Setting average rating for offer with ID: '${offerIdRef.toString()}' to ${roundedRating}`);
    return this.offerRepository.updateOfferRatingById(offerIdRef, roundedRating);
  }

  private async createOfferInternal(offerData: Offer): Promise<Offer | null> {
    try {
      const {city: offerCityData, host: hostUserData} = offerData;

      const cityIdRef = await this.cityService.getIdRefByName(offerCityData.name);
      if (!cityIdRef) {
        this.logger.error(`City '${offerCityData.name}' not found`);
        return null;
      }

      const hostIdRef = await this.userService.getIdRefByMail(hostUserData.email);
      if (!hostIdRef) {
        this.logger.error(`Host user '${hostUserData.email}' not found`);
        return null;
      }

      const createdOffer = new OfferEntity(offerData, cityIdRef, hostIdRef);
      const result = await this.offerRepository.create(createdOffer);

      this.logger.info(`New [offer] created: ${createdOffer.title}`);
      return result.populate(['cityId', 'hostId']);

    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error creating offer '${offerData.title}'. `, error);
      } else {
        this.logger.error(`Error creating offer '${offerData.title}'. An unknown error.`);
      }
      return null;
    }
  }
}
