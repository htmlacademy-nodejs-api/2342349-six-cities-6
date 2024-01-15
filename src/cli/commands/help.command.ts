import chalk from 'chalk';
import {fileRead} from '../../utils/file-read.js';
import {Command} from './command.interface.js';

export class HelpCommand implements Command {
  private readonly filePath: string = './src/cli/help.txt';

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.green(this.readHelp()));
  }

  public getName(): string {
    return '--help';
  }

  private readHelp(): string {
    return fileRead(this.filePath);
  }
}
