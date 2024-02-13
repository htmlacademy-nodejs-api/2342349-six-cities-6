import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {Offer} from '#src/rest/modules/offer/offer.type.js';
import {DocumentType, Ref} from '@typegoose/typegoose';

export interface OfferRepository {
  create(offerData: Offer): Promise<DocumentType<OfferEntity>>;

  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  findByTitle(offerTitle: string): Promise<DocumentType<OfferEntity> | null>;

  findByCity(cityId: string, requestedLimit?: number): Promise<DocumentType<OfferEntity>[]>;

  findPremiumByCity(cityId: string, requestedLimit?: number): Promise<DocumentType<OfferEntity>[]>;

  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  updateById(offerId: string, offerData: Offer): Promise<DocumentType<OfferEntity> | null>

  exists(offerId: string): Promise<boolean>;

  findFavoriteByUser(favoriteOfferIds: string[], effectiveLimit: number): Promise<DocumentType<OfferEntity>[]>;

  incrementReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean | null>;

  updateOfferRatingById(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean | null>;
}
