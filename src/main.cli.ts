#!/usr/bin/env node
import {CliApplication} from '#src/cli/cli-application.js';
import {GenerateCommand} from '#src/cli/commands/generate.command.js';
import {HelpCommand} from '#src/cli/commands/help.command.js';
import {ImportCommand} from '#src/cli/commands/import.command.js';
import {VersionCommand} from '#src/cli/commands/version.command.js';
import {TsvOfferGenerator} from '#src/offers/generator/tsv-offer-generator.js';
import {TsvOfferParser} from '#src/offers/parser/tsv-offer-parser.js';
import {TsvFileReader} from '#src/offers/reader/tsv-file-reader.js';
import {TsvFileWriter} from '#src/offers/writer/tsv-file-writer.js';

function bootstrap() {
  const cliApplication = new CliApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(new TsvOfferParser(), new TsvFileReader()),
    new GenerateCommand(new TsvOfferGenerator(), new TsvFileWriter())
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
