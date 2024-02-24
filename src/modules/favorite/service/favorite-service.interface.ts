import {ShortOfferRdo} from '#src/modules/offer/dto/short-offer.rdo.js';
import {DocumentExists} from '#src/rest/middleware/document-exists.interface.js';

export interface FavoriteService extends DocumentExists {
  findByUser(userId: string, requestedLimit?: number): Promise<ShortOfferRdo[]>;

  addByOfferId(offerId: string, userId: string): Promise<void>;

  deleteByOfferId(offerId: string, userId: string): Promise<void>;

  exists(offerId: string): Promise<boolean>;
}
