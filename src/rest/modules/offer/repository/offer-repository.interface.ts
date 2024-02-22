import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {Offer} from '#src/rest/modules/offer/type/offer.type.js';
import {DocumentType, Ref} from '@typegoose/typegoose';
import mongoose from 'mongoose';

export interface OfferRepository {
  create(offerData: Offer): Promise<DocumentType<OfferEntity>>;

  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  findByTitle(offerTitle: string): Promise<DocumentType<OfferEntity> | null>;

  findAllWithLimit(effectiveLimit: number): Promise<DocumentType<OfferEntity>[]>;

  findByCity(cityId: string, requestedLimit?: number): Promise<DocumentType<OfferEntity>[]>;

  findPremiumByCity(cityId: string, requestedLimit?: number): Promise<DocumentType<OfferEntity>[]>;

  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  updateById(offerId: string, offerData: Partial<Offer>): Promise<DocumentType<OfferEntity> | null>

  exists(offerId: mongoose.Types.ObjectId): Promise<boolean>;

  findByIdList(offerIds: string[], effectiveLimit: number): Promise<DocumentType<OfferEntity>[]>;

  incrementReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean>;

  updateOfferRatingById(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean>;
}
