import {CityService} from '#src/modules/city/service/city-service.interface.js';
import {ShortOfferRdo} from '#src/modules/offer/dto/short-offer.rdo.js';
import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {OfferRepository} from '#src/modules/offer/repository/offer-repository.interface.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {Offer} from '#src/modules/offer/type/offer.type.js';
import {UserService} from '#src/modules/user/service/user-service.interface.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Component} from '#src/types/component.enum.js';
import {ListLimitsConfig} from '#src/utils/config.constants.js';
import {fillDTO} from '#src/utils/dto.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Ref} from '@typegoose/typegoose';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import mongoose from 'mongoose';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferRepository) private readonly offerRepository: OfferRepository,
    @inject(Component.CityService) private readonly cityService: CityService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
  }

  public async findShorts(cityId?: string, requestedLimit: number = ListLimitsConfig.OFFERS_LIST_LIMIT_DEFAULT): Promise<ShortOfferRdo[]> {
    if (requestedLimit && requestedLimit > ListLimitsConfig.OFFERS_LIST_LIMIT) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The 'limit' parameter cannot exceed ${ListLimitsConfig.OFFERS_LIST_LIMIT}.`,
        'OfferService'
      );
    }
    if (cityId && !await this.cityService.checkExists(cityId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `City with ID '${cityId}' not found.`,
        'OfferService'
      );
    }

    const effectiveLimit = Math.min(requestedLimit ?? Number.MAX_VALUE, ListLimitsConfig.OFFERS_LIST_LIMIT);
    const foundOffers = cityId
      ? await this.offerRepository.findByCity(cityId, effectiveLimit)
      : await this.offerRepository.findAll(effectiveLimit);

    //todo JWT
    const shortOfferRDOs = fillDTO(ShortOfferRdo, foundOffers);
    const shortOffersWithFavoriteFlag = this.addFavoriteFlag(shortOfferRDOs);

    const searchScope = cityId ? `in city '${cityId}'` : 'for all cities';
    this.logger.info(`Completed search ${searchScope}. Found ${shortOffersWithFavoriteFlag.length} offers.`);
    return shortOffersWithFavoriteFlag;
  }

  public async create(offerParams: Omit<Offer, 'rating' | 'isFavorite'>): Promise<Offer> {
    const offerTitleTrimmed = offerParams.title.trim();
    const existedOffer = await this.offerRepository.findByTitle(offerTitleTrimmed);
    if (existedOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Offer with title '${offerTitleTrimmed}' exists.`,
        'OfferService'
      );
    }

    const offerData: Offer = {
      ...offerParams,
      isFavorite: false,
      rating: 0,
    };

    return await this.createOfferInternal(offerData);
  }

  public async findPremiumByCity(cityId: string, requestedLimit?: number): Promise<OfferEntity[]> {
    if (requestedLimit && requestedLimit > ListLimitsConfig.PREMIUM_LIST_LIMIT) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The 'limit' parameter cannot exceed ${ListLimitsConfig.PREMIUM_LIST_LIMIT}.`,
        'OfferService'
      );
    }
    if (!await this.cityService.checkExists(cityId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `City with ID '${cityId}' not found.`,
        'OfferService'
      );
    }

    const effectiveLimit = Math.min(requestedLimit ?? Number.MAX_VALUE, ListLimitsConfig.PREMIUM_LIST_LIMIT);
    const premiumCityOffers = await this.offerRepository.findPremiumByCity(cityId, effectiveLimit);

    this.logger.info(`Completed search for premium offers in city '${cityId}'. Found ${premiumCityOffers.length} offers.`);
    return premiumCityOffers;
  }

  public async incrementReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean> {
    this.logger.info(`Attempting to increment review count for offer with ID: '${offerIdRef.toString()}'`);
    return this.offerRepository.incrementReviewCount(offerIdRef);
  }

  public async find(offerId: string): Promise<Offer> {
    const existedOffer = await this.offerRepository.findById(offerId);
    if (!existedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ID '${offerId}' not found.`,
        'OfferService'
      );
    }

    this.logger.info(`Found offer with ID ${offerId}`);
    return existedOffer;
  }

  public async findById(offerId: string): Promise<OfferEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return null;
    }
    return await this.offerRepository.findById(offerId);
  }

  public async checkExists(offerId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return false;
    }

    const objectId = new mongoose.Types.ObjectId(offerId);
    return this.offerRepository.exists(objectId);
  }

  public async updateById(offerId: string, offerData: Partial<Offer>): Promise<Offer> {
    if (!await this.checkExists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ID '${offerId}' not found.`,
        'OfferService'
      );
    }

    const updatedOffer = await this.offerRepository.updateById(offerId, offerData);
    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Offer with ID '${offerId}' can't be update`,
        'OfferService'
      );
    }

    this.logger.info(`Offer with ID ${offerId} updated`);
    return updatedOffer;
  }

  public async deleteById(offerId: string): Promise<Offer> {
    if (!await this.checkExists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ID '${offerId}' not found.`,
        'OfferService'
      );
    }

    const deletedOffer = await this.offerRepository.deleteById(offerId);
    if (!deletedOffer) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Offer with ID '${offerId}' can't be delete`,
        'OfferService'
      );
    }

    this.logger.info(`Offer with ID ${offerId} deleted`);
    return deletedOffer;
  }

  public async findOrCreate(offerData: Offer): Promise<Offer> {
    const offerTitleTrimmed = offerData.title.trim();
    const existedOffer = await this.offerRepository.findByTitle(offerTitleTrimmed);

    return existedOffer ?? await this.createOfferInternal(offerData);
  }

  public async setRating(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean> {
    const roundedRating = Number(averageRating.toFixed(2));
    this.logger.info(`Setting average rating for offer with ID: '${offerIdRef.toString()}' to ${roundedRating}`);
    return this.offerRepository.updateRating(offerIdRef, roundedRating);
  }

  public async findByIdList(offerIds: Ref<OfferEntity>[], limit: number): Promise<OfferEntity[]> {
    return this.offerRepository.findByIds(offerIds, limit);
  }

  public async getIdRefByTitle(offerTitle: string): Promise<Ref<OfferEntity> | null> {
    const offerTitleTrimmed = offerTitle.trim();
    const foundOffer = await this.offerRepository.findByTitle(offerTitleTrimmed);

    return foundOffer?.id ?? null;
  }

  private async createOfferInternal(offerData: Offer): Promise<Offer> {
    const {city: offerCityData, host: hostUserData} = offerData;

    const cityIdRef = await this.cityService.getIdRefByName(offerCityData.name);
    if (!cityIdRef) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `City '${offerCityData.name}' not found`,
        'OfferService'
      );
    }

    const hostIdRef = await this.userService.getIdRefByEmail(hostUserData.email);
    if (!hostIdRef) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Host user '${hostUserData.email}' not found`,
        'OfferService'
      );
    }

    try {
      const createdOffer = new OfferEntity(offerData, cityIdRef, hostIdRef);
      const result = await this.offerRepository.create(createdOffer);

      this.logger.info(`New [offer] created: ${createdOffer.title}`);
      return result.populate(['cityId', 'hostId']);

    } catch (error) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error creating offer '${offerData.title}'. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`,
        'OfferService'
      );
    }
  }

  public addFavoriteFlag<T extends object>(input: T): T;

  public addFavoriteFlag<T extends object>(input: T[]): T[];

  public addFavoriteFlag<T extends object>(input: T | T[]): T | T [] {
    if (Array.isArray(input)) {
      return input.map((item) => ({...item, isFavorite: true})) as (T & { isFavorite: boolean })[];
    } else {
      return {...input, isFavorite: true} as T & { isFavorite: boolean };
    }
  }
}
