#!/usr/bin/env node
import 'reflect-metadata';
import {createCityContainer} from '#src/rest/modules/city/city.container.js';
import {createFavoriteContainer} from '#src/rest/modules/favorite/favorite.container.js';
import {createOfferContainer} from '#src/rest/modules/offer/offer.container.js';
import {createReviewContainer} from '#src/rest/modules/review/review.container.js';
import {createUserContainer} from '#src/rest/modules/user/user.container.js';
import {RestApplication} from '#src/rest/rest.application.js';
import {createRestApplicationContainer} from '#src/rest/rest.container.js';
import {Component} from '#src/types/component.enum.js';
import {Container} from 'inversify';


async function bootstrap() {
  const restApplicationContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createCityContainer(),
    createOfferContainer(),
    createReviewContainer(),
    createFavoriteContainer()
  );
  const restApplication = restApplicationContainer.get<RestApplication>(Component.RestApplication);
  await restApplication.init();
}

bootstrap();
