import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {OfferRepository} from '#src/modules/offer/repository/offer-repository.interface.js';
import {Offer} from '#src/modules/offer/type/offer.type.js';
import {Component} from '#src/types/component.enum.js';
import {DocumentType, Ref, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import mongoose from 'mongoose';


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

  public async findAllWithLimit(effectiveLimit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({}, {}, {limit: effectiveLimit})
      .sort({publishDate: -1})
      .populate(['cityId', 'hostId']);
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

  public async findByIdList(offerIds: Ref<OfferEntity>[], effectiveLimit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({_id: {$in: offerIds}}, {}, {effectiveLimit})
      .sort({publishDate: -1})
      .populate(['cityId', 'hostId']);
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .populate(['cityId', 'hostId']);
  }

  public async updateById(offerId: string, offerData: Partial<Offer>): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, offerData, {new: true})
      .populate(['cityId', 'hostId']);
  }

  public async exists(offerId: mongoose.Types.ObjectId): Promise<boolean> {
    const isOfferExists = await this.offerModel.exists({_id: offerId});
    return !!isOfferExists;
  }

  public async incrementReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean> {
    const updatedOffer = await this.offerModel.findByIdAndUpdate(offerIdRef, {'$inc': {reviewCount: 1}}, {new: true});
    return !!updatedOffer;
  }

  public async updateOfferRatingById(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean> {
    const updatedOffer = await this.offerModel.findByIdAndUpdate(offerIdRef, {rating: averageRating}, {new: true});
    return !!updatedOffer;
  }
}
