import {Component} from '#src/types/component.enum.js';
import {DefaultOfferService} from '#src/utils/modules/offer/default-offer.service.js';
import {OfferService} from '#src/utils/modules/offer/offer-service.interface.js';
import {OfferEntity, OfferModel} from '#src/utils/modules/offer/offer.entity.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createOfferContainer(): Container {
  const offerContainer = new Container();
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();

  return offerContainer;
}
