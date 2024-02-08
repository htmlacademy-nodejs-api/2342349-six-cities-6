import {Offer} from '#src/rest/modules/offer/offer.type.js';

export interface OfferParser {
  parserOffer(data: string): Offer;
}
