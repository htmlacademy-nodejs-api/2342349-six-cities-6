#!/usr/bin/env node
import {RestApplication} from '#src/rest/rest.application.js';
import {createRestApplicationContainer} from '#src/rest/rest.container.js';
import {Component} from '#src/types/component.enum.js';


async function bootstrap() {
  // todo
  // const restApplicationContainer = Container.merge(createRestApplicationContainer());
  const restApplicationContainer = createRestApplicationContainer();
  const restApplication = restApplicationContainer.get<RestApplication>(Component.RestApplication);
  await restApplication.init();
}

bootstrap();
