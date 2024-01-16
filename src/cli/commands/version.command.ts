import {BaseCommand} from '#src/cli/commands/base-command.js';
import {fileRead} from '#src/utils/file-read.js';
import {jsonParse} from '#src/utils/json-parse.js';
import chalk from 'chalk';

export class VersionCommand extends BaseCommand {
  private readonly filePath = './package.json';
  private readonly _name = '--version';

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.blue(await this.readVersion()));
  }

  private isJsonConfig(obj: unknown): obj is {version?: string} {
    return typeof obj === 'object' && obj !== null && 'version' in obj;
  }

  private async readVersion(): Promise<string> {
    const rawFileContent = await fileRead(this.filePath);
    const fileConfig = jsonParse(rawFileContent);
    if (!this.isJsonConfig(fileConfig) || typeof fileConfig.version !== 'string') {
      throw new Error(`'version' field is missing or not a string in the file at ${this.filePath}`);
    }
    return fileConfig.version;
  }

  get name(): string {
    return this._name;
  }
}

