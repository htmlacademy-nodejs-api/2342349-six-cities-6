import {BaseCommand} from '#src/cli/commands/base-command.js';
import {fileRead} from '#src/utils/file-read.js';
import chalk from 'chalk';

export class HelpCommand extends BaseCommand {
  private readonly filePath = './src/cli/help.txt';
  private readonly _name = '--help';

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.green(await this.readHelp()));
  }

  private async readHelp(): Promise<string> {
    return fileRead(this.filePath);
  }

  get name(): string {
    return this._name;
  }
}
