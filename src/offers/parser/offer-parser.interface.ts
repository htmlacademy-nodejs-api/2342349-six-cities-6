import {Offer} from '#src/utils/modules/offer/offer.type.js';

export interface OfferParser {
  parserOffer(data: string): Offer;
}
