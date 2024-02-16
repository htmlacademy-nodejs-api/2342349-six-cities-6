import 'reflect-metadata';
import {CliApplication} from '#src/cli/cli-application.js';
import {GenerateCommand} from '#src/cli/commands/generate.command.js';
import {HelpCommand} from '#src/cli/commands/help.command.js';
import {ImportCommand} from '#src/cli/commands/import.command.js';
import {VersionCommand} from '#src/cli/commands/version.command.js';
import {OfferGenerator} from '#src/offers/generator/offer-generator.interface.js';
import {TsvOfferGenerator} from '#src/offers/generator/tsv-offer-generator.js';
import {OfferParser} from '#src/offers/parser/offer-parser.interface.js';
import {TsvOfferParser} from '#src/offers/parser/tsv-offer-parser.js';
import {FileReader} from '#src/offers/reader/file-reader.interface.js';
import {TsvFileReader} from '#src/offers/reader/tsv-file-reader.js';
import {FileWriter} from '#src/offers/writer/file-writer.interface.js';
import {TsvFileWriter} from '#src/offers/writer/tsv-file-writer.js';
import {CityEntity, CityModel} from '#src/rest/modules/city/city.entity.js';
import {CityRepository} from '#src/rest/modules/city/repositories/city-repository.interface.js';
import {MongoCityRepository} from '#src/rest/modules/city/repositories/mongo-city.repository.js';
import {CityService} from '#src/rest/modules/city/services/city-service.interface.js';
import {DefaultCityService} from '#src/rest/modules/city/services/default-city.service.js';
import {OfferEntity, OfferModel} from '#src/rest/modules/offer/offer.entity.js';
import {MongoOfferRepository} from '#src/rest/modules/offer/repositories/mongo-offer.repository.js';
import {OfferRepository} from '#src/rest/modules/offer/repositories/offer-repository.interface.js';
import {DefaultOfferService} from '#src/rest/modules/offer/services/default-offer.service.js';
import {OfferService} from '#src/rest/modules/offer/services/offer-service.interface.js';
import {MongoUserRepository} from '#src/rest/modules/user/repositories/mongo-user.repository.js';
import {UserRepository} from '#src/rest/modules/user/repositories/user-repository.interface.js';
import {DefaultUserService} from '#src/rest/modules/user/services/default-user.service.js';
import {UserService} from '#src/rest/modules/user/services/user-service.interface.js';
import {UserEntity, UserModel} from '#src/rest/modules/user/user.entity.js';
import {Component} from '#src/types/component.enum.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestConfig} from '#src/utils/config/rest.config.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {Argon2Crypto} from '#src/utils/crypto/argon2.crypto.js';
import {CryptoProtocol} from '#src/utils/crypto/crypto.interface.js';
import {DatabaseClient} from '#src/utils/database-client/database-client.interface.js';
import {MongoDatabaseClient} from '#src/utils/database-client/mongo.database-client.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {PinoLogger} from '#src/utils/logger/pino.logger.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createCliApplicationContainer(): Container {
  const cliApplicationContainer = new Container({skipBaseClassChecks: true});

  cliApplicationContainer.bind<CliApplication>(Component.CliApplication).to(CliApplication).inSingletonScope();
  cliApplicationContainer.bind<HelpCommand>(Component.HelpCommand).to(HelpCommand).inSingletonScope();
  cliApplicationContainer.bind<VersionCommand>(Component.VersionCommand).to(VersionCommand).inSingletonScope();
  cliApplicationContainer.bind<ImportCommand>(Component.ImportCommand).to(ImportCommand).inSingletonScope();
  cliApplicationContainer.bind<GenerateCommand>(Component.GenerateCommand).to(GenerateCommand).inSingletonScope();

  cliApplicationContainer.bind<OfferParser>(Component.OfferParser).to(TsvOfferParser).inSingletonScope();
  cliApplicationContainer.bind<OfferGenerator>(Component.OfferGenerator).to(TsvOfferGenerator).inSingletonScope();
  cliApplicationContainer.bind<FileReader>(Component.FileReader).to(TsvFileReader).inSingletonScope();
  cliApplicationContainer.bind<FileWriter>(Component.FileWriter).to(TsvFileWriter).inSingletonScope();

  cliApplicationContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  cliApplicationContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  cliApplicationContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  cliApplicationContainer.bind<CryptoProtocol>(Component.Crypto).to(Argon2Crypto).inSingletonScope();

  cliApplicationContainer.bind<types.ModelType<CityEntity>>(Component.CityModel).toConstantValue(CityModel);
  cliApplicationContainer.bind<CityService>(Component.CityService).to(DefaultCityService).inSingletonScope();
  cliApplicationContainer.bind<CityRepository>(Component.CityRepository).to(MongoCityRepository).inSingletonScope();

  cliApplicationContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  cliApplicationContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  cliApplicationContainer.bind<OfferRepository>(Component.OfferRepository).to(MongoOfferRepository).inSingletonScope();

  cliApplicationContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  cliApplicationContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  cliApplicationContainer.bind<UserRepository>(Component.UserRepository).to(MongoUserRepository).inSingletonScope();

  return cliApplicationContainer;
}
