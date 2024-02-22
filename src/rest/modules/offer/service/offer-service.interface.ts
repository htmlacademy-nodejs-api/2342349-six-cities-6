import {ShortOfferRdo} from '#src/rest/modules/offer/dto/short-offer.rdo.js';
import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {Offer} from '#src/rest/modules/offer/type/offer.type.js';
import {Ref} from '@typegoose/typegoose';

export interface OfferService {
  create(offerParams: Omit<Offer, 'rating' | 'isFavorite'>): Promise<Offer>;

  find(offerId: string): Promise<Offer>;

  findOrCreate(offerData: Offer): Promise<Offer>;

  findById(offerId: string): Promise<OfferEntity | null>;

  findShortOffers(cityId?: string, requestedLimit?: number): Promise<ShortOfferRdo[]>;

  checkExists(offerId: string): Promise<boolean>;

  updateById(offerId: string, offerData: Partial<Offer>): Promise<Offer>;

  deleteById(offerId: string): Promise<Offer>;

  getIdRefByTitle(offerTitle: string): Promise<Ref<OfferEntity> | null>;

  findPremiumByCity(cityId: string, requestedLimit?: number): Promise<OfferEntity[]>;

  findByIdList(offerIds: string[], limit: number): Promise<OfferEntity[]>;

  incrementOfferReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean>;

  setOfferAverageRating(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean>;

  addFavoriteFlag<T>(input: T): T;

  addFavoriteFlag<T>(input: T[]): T[];
}
