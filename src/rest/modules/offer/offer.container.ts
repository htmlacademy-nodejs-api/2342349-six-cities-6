import {DefaultOfferService} from '#src/rest/modules/offer/default-offer.service.js';
import {OfferService} from '#src/rest/modules/offer/offer-service.interface.js';
import {OfferEntity, OfferModel} from '#src/rest/modules/offer/offer.entity.js';
import {Component} from '#src/types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createOfferContainer(): Container {
  const offerContainer = new Container();
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();

  return offerContainer;
}
