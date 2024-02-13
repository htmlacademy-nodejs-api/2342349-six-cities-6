import {OfferEntity, OfferModel} from '#src/rest/modules/offer/offer.entity.js';
import {MongoOfferRepository} from '#src/rest/modules/offer/repositories/mongo-offer.repository.js';
import {OfferRepository} from '#src/rest/modules/offer/repositories/offer-repository.interface.js';
import {DefaultOfferService} from '#src/rest/modules/offer/services/default-offer.service.js';
import {OfferService} from '#src/rest/modules/offer/services/offer-service.interface.js';
import {Component} from '#src/types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createOfferContainer(): Container {
  const offerContainer = new Container();
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  offerContainer.bind<OfferRepository>(Component.OfferRepository).to(MongoOfferRepository).inSingletonScope();

  return offerContainer;
}
