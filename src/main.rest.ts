#!/usr/bin/env node
import 'reflect-metadata';
import {RestApplication} from '#src/rest/rest.application.js';
import {createRestApplicationContainer} from '#src/rest/rest.container.js';
import {Component} from '#src/types/component.enum.js';
import {createCityContainer} from '#src/utils/modules/city/city.container.js';
import {createLocationContainer} from '#src/utils/modules/location/location.container.js';
import {createOfferContainer} from '#src/utils/modules/offer/offer.container.js';
import {createReviewContainer} from '#src/utils/modules/review/review.container.js';
import {createUserContainer} from '#src/utils/modules/user/user.container.js';
import {Container} from 'inversify';


async function bootstrap() {
  const restApplicationContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createCityContainer(),
    createLocationContainer(),
    createOfferContainer(),
    createReviewContainer()
  );
  const restApplication = restApplicationContainer.get<RestApplication>(Component.RestApplication);
  await restApplication.init();
}

bootstrap();
