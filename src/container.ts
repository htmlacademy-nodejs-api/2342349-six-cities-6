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
import {RestApplication} from '#src/rest/rest.application.js';
import {Component} from '#src/types/component.enum.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestConfig} from '#src/utils/config/rest.config.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {PinoLogger} from '#src/utils/logger/pino.logger.js';
import {Container as InversifyContainer} from 'inversify';

export class Container {
  public static createRestContainer(): InversifyContainer {
    const container = new InversifyContainer();
    container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
    container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
    container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

    return container;
  }

  public static createCliContainer(): InversifyContainer {
    const container = new InversifyContainer({skipBaseClassChecks: true});
    container.bind<CliApplication>(Component.CliApplication).to(CliApplication).inSingletonScope();
    container.bind<HelpCommand>(Component.HelpCommand).to(HelpCommand).inSingletonScope();
    container.bind<VersionCommand>(Component.VersionCommand).to(VersionCommand).inSingletonScope();
    container.bind<ImportCommand>(Component.ImportCommand).to(ImportCommand).inSingletonScope();
    container.bind<GenerateCommand>(Component.GenerateCommand).to(GenerateCommand).inSingletonScope();

    container.bind<OfferParser>(Component.OfferParser).to(TsvOfferParser).inSingletonScope();
    container.bind<OfferGenerator>(Component.OfferGenerator).to(TsvOfferGenerator).inSingletonScope();
    container.bind<FileReader>(Component.FileReader).to(TsvFileReader).inSingletonScope();
    container.bind<FileWriter>(Component.FileWriter).to(TsvFileWriter).inSingletonScope();

    return container;
  }
}

