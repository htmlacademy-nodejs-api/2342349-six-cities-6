import {FavoriteService} from '#src/modules/favorite/service/favorite-service.interface.js';
import {ShortOfferRdo} from '#src/modules/offer/dto/short-offer.rdo.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {UserService} from '#src/modules/user/service/user-service.interface.js';
import {ListLimitsConfig} from '#src/rest/config.constant.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Component} from '#src/types/component.enum.js';
import {fillDTO} from '#src/utils/dto.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';


@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
  }

  public async findByUser(userId: string, requestedLimit?: number): Promise<ShortOfferRdo[]> {
    if (requestedLimit && requestedLimit > ListLimitsConfig.FAVORITE_LIST_LIMIT) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The 'limit' parameter cannot exceed ${ListLimitsConfig.FAVORITE_LIST_LIMIT}.`,
        'FavoriteService'
      );
    }

    const currentUser = await this.userService.findById(userId);
    if (!currentUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with ID '${userId}' not found.`,
        'FavoriteService'
      );
    }

    const favoriteOfferIds = currentUser.favoriteOffers;
    if (!favoriteOfferIds.length) {
      this.logger.info(`No favorite offers for user '${currentUser.email}'.`);
      return [];
    }

    const effectiveLimit = Math.min(requestedLimit ?? Number.MAX_VALUE, ListLimitsConfig.FAVORITE_LIST_LIMIT);
    const favoriteOffers = await this.offerService.findByIdList(favoriteOfferIds, effectiveLimit);
    if (!favoriteOffers.length) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `No favorite offers for User with ID '${userId}' by error.`,
        'FavoriteService'
      );
    }

    const shortOfferRDOs = fillDTO(ShortOfferRdo, favoriteOffers);
    const shortOffersWithFavoriteFlag = this.offerService.addFavoriteFlag(shortOfferRDOs);

    this.logger.info(`Found ${shortOffersWithFavoriteFlag.length} favorite offers for user '${currentUser.email}'.`);
    return shortOffersWithFavoriteFlag;
  }

  public async addByOfferId(offerId: string, userId: string): Promise<void> {
    const currentUser = await this.userService.findById(userId);
    if (!currentUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with ID '${userId}' not found.`,
        'FavoriteService'
      );
    }

    const currentOffer = await this.offerService.findById(offerId);
    if (!currentOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ID '${offerId}' not found.`,
        'FavoriteService'
      );
    }

    const isSuccess = await this.userService.addFavoriteOffer(currentUser, currentOffer);
    if (!isSuccess) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Can't add Offer ID '${offerId}' to favorite user '${currentUser.email}'`,
        'FavoriteService'
      );
    }

    this.logger.info(`Offer ID '${offerId}' added to favorite for user '${currentUser.email}'.`);
  }

  public async deleteByOfferId(offerId: string, userId: string): Promise<void> {
    const currentUser = await this.userService.findById(userId);
    if (!currentUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with ID '${userId}' not found.`,
        'FavoriteService'
      );
    }

    const currentOffer = await this.offerService.findById(offerId);
    if (!currentOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ID '${offerId}' not found.`,
        'FavoriteService'
      );
    }

    const isSuccess = await this.userService.deleteFavoriteOffer(currentUser, currentOffer);
    if (!isSuccess) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Can't delete Offer ID '${offerId}' from favorite user '${currentUser.email}'`,
        'FavoriteService'
      );
    }

    this.logger.info(`Offer ID '${offerId}' deleted from favorite for user '${currentUser.email}'.`);
  }

  public async exists(offerId: string): Promise<boolean> {
    return this.offerService.exists(offerId);
  }
}
