#!/usr/bin/env node
import {ContainerConfig} from '#src/container.js';
import {RestApplication} from '#src/rest/rest.application.js';
import {Component} from '#src/types/component.enum.js';


async function bootstrap() {
  const restContainer = ContainerConfig.createRestContainer();
  const application = restContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
