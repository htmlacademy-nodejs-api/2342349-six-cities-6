import {Controller} from '#src/rest/controller/controller.interface.js';
import {OfferController} from '#src/rest/modules/offer/offer.controller.js';
import {OfferEntity, OfferModel} from '#src/rest/modules/offer/offer.entity.js';
import {MongoOfferRepository} from '#src/rest/modules/offer/repository/mongo-offer.repository.js';
import {OfferRepository} from '#src/rest/modules/offer/repository/offer-repository.interface.js';
import {DefaultOfferService} from '#src/rest/modules/offer/service/default-offer.service.js';
import {OfferService} from '#src/rest/modules/offer/service/offer-service.interface.js';
import {Component} from '#src/types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createOfferContainer(): Container {
  const offerContainer = new Container();
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  offerContainer.bind<OfferRepository>(Component.OfferRepository).to(MongoOfferRepository).inSingletonScope();
  offerContainer.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();

  return offerContainer;
}
