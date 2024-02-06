import {OfferEntity} from '#src/utils/modules/offer/offer.entity.js';
import {Offer} from '#src/utils/modules/offer/offer.type.js';
import {DocumentType} from '@typegoose/typegoose';

export interface OfferService {
  fineOrCreate(offerData: Offer): Promise<DocumentType<OfferEntity>>;

  findById(id: number): Promise<DocumentType<OfferEntity> | null>;

  findByTitle(offerTitle: string): Promise<DocumentType<OfferEntity> | null>;
}
