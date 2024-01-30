#!/usr/bin/env node
import {CliApplication} from '#src/cli/cli-application.js';
import {GenerateCommand} from '#src/cli/commands/generate.command.js';
import {HelpCommand} from '#src/cli/commands/help.command.js';
import {ImportCommand} from '#src/cli/commands/import.command.js';
import {VersionCommand} from '#src/cli/commands/version.command.js';
import {Container} from '#src/container.js';
import {Component} from '#src/types/component.enum.js';

function bootstrap() {
  const cliContainer = Container.createCliContainer();
  const cliApplication = cliContainer.get<CliApplication>(Component.CliApplication);

  cliApplication.registerCommands([
    cliContainer.get<HelpCommand>(Component.HelpCommand),
    cliContainer.get<VersionCommand>(Component.VersionCommand),
    cliContainer.get<ImportCommand>(Component.ImportCommand),
    cliContainer.get<GenerateCommand>(Component.GenerateCommand),
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
