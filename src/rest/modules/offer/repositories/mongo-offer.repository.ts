import {OfferEntity} from '#src/rest/modules/offer/offer.entity.js';
import {Offer} from '#src/rest/modules/offer/offer.type.js';
import {OfferRepository} from '#src/rest/modules/offer/repositories/offer-repository.interface.js';
import {Component} from '#src/types/component.enum.js';
import {DocumentType, Ref, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';


@injectable()
export class MongoOfferRepository implements OfferRepository {
  constructor(
    @inject(Component.OfferModel) private offerModel: types.ModelType<OfferEntity>,
  ) {
  }

  public async create(offerData: Offer): Promise<DocumentType<OfferEntity>> {
    const createdOffer = await this.offerModel.create(offerData);
    return createdOffer.populate(['cityId', 'hostId']);
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['cityId', 'hostId']);
  }

  public async findByTitle(offerTitle: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOne({title: offerTitle});
  }

  public async findByCity(cityId: string, effectiveLimit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({cityId}, {}, {limit: effectiveLimit})
      .sort({publishDate: -1})
      .populate(['cityId', 'hostId']);
  }

  public async findPremiumByCity(cityId: string, effectiveLimit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({cityId, isPremium: true}, {}, {limit: effectiveLimit})
      .sort({publishDate: -1})
      .populate(['cityId', 'hostId']);
  }

  public async findFavoriteByUser(favoriteOfferIds: string[], effectiveLimit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({_id: {$in: favoriteOfferIds}}, {}, {effectiveLimit})
      .populate(['cityId', 'hostId']);
  }


  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .populate(['cityId', 'hostId']);
  }

  public async updateById(offerId: string, offerData: Offer): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, offerData, {new: true})
      .populate(['cityId', 'hostId']);
  }

  public async exists(offerId: string): Promise<boolean> {
    return this.offerModel.exists({_id: offerId}) !== null;
  }

  public async incrementReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean | null> {
    return this.offerModel.findByIdAndUpdate(offerIdRef, {'$inc': {reviewCount: 1}});
  }

  public async updateOfferRatingById(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean | null> {
    return this.offerModel.findByIdAndUpdate(offerIdRef, {rating: averageRating});
  }
}
