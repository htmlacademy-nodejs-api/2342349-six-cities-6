import {BaseCommand} from '#src/cli/commands/base-command.js';
import {OfferParser} from '#src/offers/parser/offer-parser.interface.js';
import {FileReader} from '#src/offers/reader/file-reader.interface.js';
import {Component} from '#src/types/component.enum.js';
import {DbParam} from '#src/types/db-param.type.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {DatabaseClient} from '#src/utils/database-client/database-client.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {inject, injectable} from 'inversify';

@injectable()
export class ImportCommand extends BaseCommand {
  protected readonly _name: string = '--import';

  constructor(
    @inject(Component.OfferParser) private readonly offerParser: OfferParser,
    @inject(Component.FileReader) private readonly fileReader: FileReader,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.Logger) private readonly logger: Logger,
  ) {
    super();
  }

  public async execute(...parameters: string[]): Promise<void> {
    const {fileList, dbParam} = this.parseInput(parameters);
    this.validateInput(fileList);

    this.logger.info('Init database...');
    await this.initDb(dbParam);

    this.logger.info('Init database completed');
    await this.parseFileList(fileList);
    await this.databaseClient.disconnect();
  }

  private parseInput(input: string[]): { fileList: string[], dbParam: DbParam } {
    const dbParamKeys: { [key: string]: keyof DbParam } = {
      '-u': 'dbUser',
      '-p': 'dbPassword',
      '-h': 'dbHost',
      '-P': 'dbPort',
      '-n': 'dbName',
    };
    const dbParam: Partial<DbParam> = {};
    const fileList: string[] = [];

    for (let i = 0; i < input.length; i++) {
      const arg = input[i];
      if (dbParamKeys[arg]) {
        const value = input[++i];
        if (value && !value.startsWith('-')) {
          dbParam[dbParamKeys[arg]] = value;

          this.logger.info(`Read '${dbParamKeys[arg]}' from console: ${value}`);
        } else {
          throw new Error(`Value for ${arg} is missing`);
        }
      } else if (!arg.startsWith('-')) {
        fileList.push(arg);
      }
    }

    return {fileList, dbParam: dbParam};
  }


  private validateInput(fileList: string[]): void {
    if (!fileList.length) {
      throw new Error('At least one "Filepath" is required.');
    }
    if (fileList.some((filePath) => !filePath.trim())) {
      throw new Error('All file paths must be non-empty strings.');
    }
  }

  private onImportedLine = (dataLine: string) => {
    const offer = this.offerParser.parserOffer(dataLine);
    console.info(offer);
  };

  private onCompleteImport = (count: number) => {
    this.logger.info(`${count} rows imported.`);
  };

  private async parseFileList(fileList: string[]): Promise<void> {
    for (const file of fileList) {
      this.fileReader.on('line', this.onImportedLine);
      this.fileReader.on('end', this.onCompleteImport);
      try {
        await this.fileReader.read(file);
      } catch {
        console.error(`Can't import data from file: ${file}`);
      }
    }
  }

  private async initDb(dbParams: Partial<DbParam>): Promise<void> {
    const dbParamVerified: DbParam = {
      dbUser: dbParams.dbUser ?? this.config.get('DB_USER'),
      dbPassword: dbParams.dbPassword ?? this.config.get('DB_PASSWORD'),
      dbHost: dbParams.dbHost ?? this.config.get('DB_HOST'),
      dbPort: dbParams.dbPort ?? this.config.get('DB_PORT'),
      dbName: dbParams.dbName ?? this.config.get('DB_NAME')
    };
    const dbUri = this.databaseClient.getURI(dbParamVerified);

    return this.databaseClient.connect(
      dbUri,
      this.config.get('DB_RETRY_COUNT'),
      this.config.get('DB_RETRY_TIMEOUT')
    );
  }
}
