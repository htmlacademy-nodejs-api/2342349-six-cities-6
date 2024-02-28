import {CityEntity} from '#src/modules/city/city.entity.js';
import {CityService} from '#src/modules/city/service/city-service.interface.js';
import {CreateOfferDTO} from '#src/modules/offer/dto/create-offer.dto.js';
import {OfferDTO} from '#src/modules/offer/dto/offer.dto.js';
import {ShortOfferRDO} from '#src/modules/offer/dto/short-offer.rdo.js';
import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {OfferRepository} from '#src/modules/offer/repository/offer-repository.interface.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {Offer} from '#src/modules/offer/type/offer.type.js';
import {UserService} from '#src/modules/user/service/user-service.interface.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {LISTLIMITSCONFIG} from '#src/rest/config.constant.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Component} from '#src/type/component.enum.js';
import {MongooseObjectId} from '#src/type/mongoose-objectid.type.js';
import {fillDTO} from '#src/utils/dto.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {validateAndResolveLimit} from '#src/utils/validator.js';
import {Ref} from '@typegoose/typegoose';
import {StatusCodes} from 'http-status-codes';
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

  public async findShorts(cityId?: string, requestedLimit: number = LISTLIMITSCONFIG.OFFERS_LIST_LIMIT_DEFAULT): Promise<ShortOfferRDO[]> {
    const limit = validateAndResolveLimit(LISTLIMITSCONFIG.OFFERS_LIST_LIMIT, 'OfferService', requestedLimit);

    if (cityId && !await this.cityService.exists(cityId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `City with ID '${cityId}' not found.`,
        'OfferService'
      );
    }

    const foundOffers = cityId
      ? await this.offerRepository.findByCity(cityId, limit)
      : await this.offerRepository.findAll(limit);

    //todo JWT
    const shortOfferRDOs = fillDTO(ShortOfferRDO, foundOffers);
    const shortOffersWithFavoriteFlag = this.addFavoriteFlag(shortOfferRDOs);

    const searchScope = cityId ? `in city '${cityId}'` : 'for all cities';
    this.logger.info(`Completed search ${searchScope}. Found ${shortOffersWithFavoriteFlag.length} offers.`);
    return shortOffersWithFavoriteFlag;
  }

  public async create(hostIdRef: Ref<UserEntity>, offerParams: CreateOfferDTO): Promise<Offer> {
    const offerTitleTrimmed = offerParams.title.trim();
    const existedOffer = await this.offerRepository.findByTitle(offerTitleTrimmed);
    if (existedOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Offer with title '${offerTitleTrimmed}' exists.`,
        'OfferService'
      );
    }

    const cityIdRef = await this.cityService.getIdRefByName(offerParams.city.name);
    if (!cityIdRef) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `City '${offerParams.city.name}' not found`,
        'OfferService'
      );
    }

    const offerData: OfferDTO = {
      ...offerParams,
      publishDate: new Date(),
    };

    return this.createOfferInternal(hostIdRef, cityIdRef, offerData);
  }

  public async findPremiumByCity(cityId: string, requestedLimit?: number): Promise<OfferEntity[]> {
    const limit = validateAndResolveLimit(LISTLIMITSCONFIG.PREMIUM_LIST_LIMIT, 'OfferService', requestedLimit);

    if (!await this.cityService.exists(cityId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `City with ID '${cityId}' not found.`,
        'OfferService'
      );
    }

    const premiumCityOffers = await this.offerRepository.findPremiumByCity(cityId, limit);

    this.logger.info(`Completed search for premium offers in city '${cityId}'. Found ${premiumCityOffers.length} offers.`);
    return premiumCityOffers;
  }

  public async incrementReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean> {
    this.logger.info(`Attempting to increment review count for offer with ID: '${offerIdRef.toString()}'`);
    return this.offerRepository.incrementReviewCount(offerIdRef);
  }

  public async exists(offerId: string): Promise<boolean> {
    if (!MongooseObjectId.isValid(offerId)) {
      return false;
    }

    const objectId = new MongooseObjectId(offerId);
    return this.offerRepository.exists(objectId);
  }

  public async findById(offerIdRef: Ref<OfferEntity>): Promise<OfferEntity | null> {
    return this.offerRepository.findById(offerIdRef);
  }

  public async updateById(offerIdRef: Ref<OfferEntity>, offerData: Partial<Offer>): Promise<Offer> {
    const updatedOffer = await this.offerRepository.updateById(offerIdRef, offerData);
    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Offer with ID '${offerIdRef.toString()}' can't be update`,
        'OfferService'
      );
    }

    if (offerIdRef !== updatedOffer.hostId.id) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `Offer with ID '${offerIdRef.toString()}' can't be update with user ID ${offerIdRef.toString()}.`,
        'OfferService'
      );
    }

    this.logger.info(`Offer with ID ${offerIdRef.toString()} updated`);
    return updatedOffer.populate(['cityId', 'hostId']);
  }

  public async deleteById(offerIdRef: Ref<OfferEntity>): Promise<Offer> {
    const deletedOffer = await this.offerRepository.deleteById(offerIdRef);
    if (!deletedOffer) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Offer with ID '${offerIdRef.toString()}' can't be delete`,
        'OfferService'
      );
    }

    if (offerIdRef !== deletedOffer.hostId.id) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `Offer with ID '${offerIdRef.toString()}' can't be delete with user ID ${offerIdRef.toString()}.`,
        'OfferService'
      );
    }

    this.logger.info(`Offer with ID ${offerIdRef.toString()} deleted`);
    return deletedOffer.populate(['cityId', 'hostId']);
  }

  public async findOrCreate(offerData: Offer): Promise<Offer> {
    const offerTitleTrimmed = offerData.title.trim();
    const existedOffer = await this.offerRepository.findByTitle(offerTitleTrimmed);
    if (existedOffer) {
      return existedOffer.populate(['cityId', 'hostId']);
    }

    const cityIdRef = await this.cityService.getIdRefByName(offerData.city.name);
    const hostIdRef = await this.userService.getIdRefByEmail(offerData.host.email);
    if (!cityIdRef || !hostIdRef) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error creating offer '${offerData.title}'. An unknown error occurred.'}`,
        'OfferService'
      );
    }

    return this.createOfferInternal(hostIdRef, cityIdRef, offerData);
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

  public async findFavorites(userIdRef: Ref<UserEntity>, requestedLimit?: number): Promise<ShortOfferRDO[]> {
    const limit = validateAndResolveLimit(LISTLIMITSCONFIG.FAVORITE_LIST_LIMIT, 'OfferService', requestedLimit);

    const favoriteOfferIds = await this.userService.getFavoriteOffers(userIdRef);
    if (!favoriteOfferIds.length) {
      this.logger.info(`No favorite offers for user ID '${userIdRef.toString()}'.`);
      return [];
    }

    const favoriteOffers = await this.findByIdList(favoriteOfferIds, limit);
    if (!favoriteOffers.length) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `No favorite offers for user ID '${userIdRef.toString()}' by error.`,
        'OfferService'
      );
    }

    const shortOfferRDOs = fillDTO(ShortOfferRDO, favoriteOffers);
    const shortOffersWithFavoriteFlag = this.addFavoriteFlag(shortOfferRDOs);

    this.logger.info(`Found ${shortOffersWithFavoriteFlag.length} favorite offers for user ID '${userIdRef.toString()}'.`);
    return shortOffersWithFavoriteFlag;
  }

  private async createOfferInternal(hostIdRef: Ref<UserEntity>, cityIdRef: Ref<CityEntity>, offerData: OfferDTO): Promise<Offer> {
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
