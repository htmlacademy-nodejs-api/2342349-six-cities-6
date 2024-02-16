import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {Offer} from '#src/rest/modules/offer/offer.type.js';
import {Ref} from '@typegoose/typegoose';

export interface OfferService {
  findOrCreate(offerData: Offer): Promise<Offer | null>;

  findByCity(cityId: string, requestedLimit?: number): Promise<OfferEntity[]>;

  findOffersByCityWithFavoriteStatus(cityId: string, userId: string, requestedLimit?: number): Promise<OfferEntity[]>;

  getIdRefByTitle(offerTitle: string): Promise<Ref<OfferEntity> | null>;

  findPremiumByCity(cityId: string, requestedLimit?: number): Promise<OfferEntity[]>;

  findFavoriteByUser(userId: string): Promise<Offer[] | null>;

  addFavoriteByUser(userId: string, offerId: string): Promise<Offer[] | null>;

  deleteFavoriteByUser(userId: string, offerId: string): Promise<Offer[] | null>;

  incrementOfferReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean | null>;

  setOfferAverageRating(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean | null>;
}
