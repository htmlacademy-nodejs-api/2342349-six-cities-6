#!/usr/bin/env node
import {ImportCommand} from './cli/commands/import.command.js';
import {CliApplication, HelpCommand, VersionCommand} from './cli/index.js';

function bootstrap() {
  const cliApplication = new CliApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand()
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
