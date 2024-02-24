import {ShortOfferRdo} from '#src/modules/offer/dto/short-offer.rdo.js';
import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {Offer} from '#src/modules/offer/type/offer.type.js';
import {DocumentExists} from '#src/rest/middleware/document-exists.interface.js';
import {Ref} from '@typegoose/typegoose';

export interface OfferService extends DocumentExists {
  create(offerParams: Omit<Offer, 'rating' | 'isFavorite'>): Promise<Offer>;

  find(offerId: string): Promise<Offer>;

  findOrCreate(offerData: Offer): Promise<Offer>;

  findById(offerId: string): Promise<OfferEntity | null>;

  findShorts(cityId?: string, requestedLimit?: number): Promise<ShortOfferRdo[]>;

  exists(offerId: string): Promise<boolean>;

  updateById(offerId: string, offerData: Partial<Offer>): Promise<Offer>;

  deleteById(offerId: string): Promise<Offer>;

  getIdRefByTitle(offerTitle: string): Promise<Ref<OfferEntity> | null>;

  findPremiumByCity(cityId: string, requestedLimit?: number): Promise<OfferEntity[]>;

  findByIdList(offerIds: Ref<OfferEntity>[], limit: number): Promise<OfferEntity[]>;

  incrementReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean>;

  setRating(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean>;

  addFavoriteFlag<T>(input: T): T;

  addFavoriteFlag<T>(input: T[]): T[];
}
