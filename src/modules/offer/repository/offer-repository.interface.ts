import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {Offer} from '#src/modules/offer/type/offer.type.js';
import {MongooseObjectId} from '#src/type/mongoose-objectid.type.js';
import {DocumentType, Ref} from '@typegoose/typegoose';

export interface OfferRepository {
  create(offerData: OfferEntity): Promise<DocumentType<OfferEntity>>;

  findByTitle(offerTitle: string): Promise<DocumentType<OfferEntity> | null>;

  findAll(limit: number, cityId?: string): Promise<DocumentType<OfferEntity>[]>;

  findPremiumByCity(cityId: string, requestedLimit?: number): Promise<DocumentType<OfferEntity>[]>;

  findById(offerIdRef: Ref<OfferEntity>): Promise<DocumentType<OfferEntity> | null>;

  deleteById(offerIdRef: Ref<OfferEntity>): Promise<DocumentType<OfferEntity> | null>;

  updateById(offerIdRef: Ref<OfferEntity>, offerData: Partial<Offer>): Promise<DocumentType<OfferEntity> | null>

  exists(offerId: MongooseObjectId): Promise<boolean>;

  findByIds(offerIds: Ref<OfferEntity>[], limit: number): Promise<DocumentType<OfferEntity>[]>;

  incrementReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean>;

  updateRating(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean>;
}
