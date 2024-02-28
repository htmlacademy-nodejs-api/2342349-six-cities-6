import {CreateOfferDTO} from '#src/modules/offer/dto/create-offer.dto.js';
import {ShortOfferRDO} from '#src/modules/offer/dto/short-offer.rdo.js';
import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {Offer} from '#src/modules/offer/type/offer.type.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {DocumentExists} from '#src/rest/middleware/document-exists.interface.js';
import {Ref} from '@typegoose/typegoose';

export interface OfferService extends DocumentExists {
  create(hostIdRef: Ref<UserEntity>, offerParams: CreateOfferDTO): Promise<Offer>;

  findOrCreate(offerData: Offer): Promise<Offer>;

  findShorts(cityId?: string, requestedLimit?: number): Promise<ShortOfferRDO[]>;

  exists(offerId: string): Promise<boolean>;

  findById(offerIdRef: Ref<OfferEntity>): Promise<OfferEntity | null>;

  updateById(offerIdRef: Ref<OfferEntity>, offerData: Partial<Offer>): Promise<Offer>;

  deleteById(offerIdRef: Ref<OfferEntity>): Promise<Offer>;

  getIdRefByTitle(offerTitle: string): Promise<Ref<OfferEntity> | null>;

  findPremiumByCity(cityId: string, requestedLimit?: number): Promise<OfferEntity[]>;

  findByIdList(offerIds: Ref<OfferEntity>[], limit: number): Promise<OfferEntity[]>;

  incrementReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean>;

  setRating(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean>;

  findFavorites(userIdRef: Ref<UserEntity>, requestedLimit?: number): Promise<ShortOfferRDO[]>;
}
