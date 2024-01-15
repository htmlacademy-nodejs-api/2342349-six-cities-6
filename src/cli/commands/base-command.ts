import {Command} from '#src/cli/commands/command.interface.js';

export abstract class BaseCommand implements Command {
  abstract execute(...parameters: string[]): void;
  abstract get name(): string;
}
