#!/usr/bin/env node
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
import {Component} from '#src/types/component.enum.js';
import {Container} from 'inversify';

function bootstrap() {
  const container = new Container({skipBaseClassChecks: true});
  container.bind<CliApplication>(Component.CliApplication).to(CliApplication).inSingletonScope();
  container.bind<HelpCommand>(Component.HelpCommand).to(HelpCommand).inSingletonScope();
  container.bind<VersionCommand>(Component.VersionCommand).to(VersionCommand).inSingletonScope();
  container.bind<ImportCommand>(Component.ImportCommand).to(ImportCommand).inSingletonScope();
  container.bind<GenerateCommand>(Component.GenerateCommand).to(GenerateCommand).inSingletonScope();

  container.bind<OfferParser>(Component.OfferParser).to(TsvOfferParser).inSingletonScope();
  container.bind<OfferGenerator>(Component.OfferGenerator).to(TsvOfferGenerator).inSingletonScope();
  container.bind<FileReader>(Component.FileReader).to(TsvFileReader).inSingletonScope();
  container.bind<FileWriter>(Component.FileWriter).to(TsvFileWriter).inSingletonScope();

  const cliApplication = container.get<CliApplication>(Component.CliApplication);
  cliApplication.registerCommands([
    container.get<HelpCommand>(Component.HelpCommand),
    container.get<VersionCommand>(Component.VersionCommand),
    container.get<ImportCommand>(Component.ImportCommand),
    container.get<GenerateCommand>(Component.GenerateCommand),
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
