import chalk from 'chalk';
import {fileRead} from '../../utils/file-read.js';
import {jsonParse} from '../../utils/json-parse.js';
import {Command} from './command.interface.js';

export class VersionCommand implements Command {
  private readonly filePath: string = './package.json';

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.blue(this.readVersion()));
  }

  public getName(): string {
    return '--version';
  }

  private isJsonConfig(obj: unknown): obj is {version?: string} {
    return typeof obj === 'object' && obj !== null && 'version' in obj;
  }

  private readVersion(): string {
    const rawFileContent = fileRead(this.filePath);
    const fileConfig = jsonParse(rawFileContent);
    if (!this.isJsonConfig(fileConfig) || typeof fileConfig.version !== 'string') {
      console.error(`'version' field is missing or not a string in the file at ${this.filePath}`);
      throw new Error('Failed to parse json content.');
    }
    return fileConfig.version;
  }
}

