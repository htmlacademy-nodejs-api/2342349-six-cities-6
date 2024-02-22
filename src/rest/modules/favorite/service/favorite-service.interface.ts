import {ShortOfferRdo} from '#src/rest/modules/offer/dto/short-offer.rdo.js';

export interface FavoriteService {
  findByUser(userId: string, requestedLimit?: number): Promise<ShortOfferRdo[]>;

  addByOfferId(offerId: string, userId: string): Promise<void>;

  deleteByOfferId(offerId: string, userId: string): Promise<void>;
}
