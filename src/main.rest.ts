#!/usr/bin/env node
import 'reflect-metadata';
import {RestApplication} from '#src/rest/rest.application.js';
import {Component} from '#src/types/component.enum.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestConfig} from '#src/utils/config/rest.config.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {PinoLogger} from '#src/utils/logger/pino.logger.js';
import {Container} from 'inversify';


async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).toDynamicValue(() => new PinoLogger('logs/rest.log')).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
