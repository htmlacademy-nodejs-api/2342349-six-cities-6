import {Offer} from '#src/rest/modules/offer/type/offer.type.js';

export interface OfferParser {
  parserOffer(data: string): Offer;
}
