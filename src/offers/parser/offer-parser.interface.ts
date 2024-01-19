import {Offer} from '#src/types/offer.type.js';

export interface OfferParser {
  parserOffer(data: string): Offer;
}
