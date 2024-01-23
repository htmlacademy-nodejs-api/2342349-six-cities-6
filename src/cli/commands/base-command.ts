import {Command} from '#src/cli/commands/command.interface.js';

export abstract class BaseCommand implements Command {
  protected readonly _name: string = '';

  abstract execute(...parameters: string[]): void;

  get name(): string {
    return this._name;
  }
}
