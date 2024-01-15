import {BaseCommand} from '#src/cli/commands/base-command.js';
import {fileRead} from '#src/utils/file-read.js';
import {jsonParse} from '#src/utils/json-parse.js';
import chalk from 'chalk';

export class VersionCommand extends BaseCommand {
  private readonly filePath = './package.json';

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.blue(await this.readVersion()));
  }

  get name(): string {
    return '--version';
  }

  private isJsonConfig(obj: unknown): obj is {version?: string} {
    return typeof obj === 'object' && obj !== null && 'version' in obj;
  }

  private async readVersion(): Promise<string> {
    const rawFileContent = await fileRead(this.filePath);
    const fileConfig = jsonParse(rawFileContent);
    if (!this.isJsonConfig(fileConfig) || typeof fileConfig.version !== 'string') {
      console.error(`'version' field is missing or not a string in the file at ${this.filePath}`);
      throw new Error('Failed to parse json content.');
    }
    return fileConfig.version;
  }
}

