import {RestApplication} from '#src/rest/rest.application.js';
import {Component} from '#src/types/component.enum.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestConfig} from '#src/utils/config/rest.config.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {Argon2Crypto} from '#src/utils/crypto/argon2.crypto.js';
import {Crypto} from '#src/utils/crypto/crypto.interface.js';
import {DatabaseClient} from '#src/utils/database-client/database-client.interface.js';
import {MongoDatabaseClient} from '#src/utils/database-client/mongo.database-client.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {PinoLogger} from '#src/utils/logger/pino.logger.js';
import {Container} from 'inversify';

export function createRestApplicationContainer(): Container {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Crypto>(Component.Crypto).to(Argon2Crypto).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

  restApplicationContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  return restApplicationContainer;
}
