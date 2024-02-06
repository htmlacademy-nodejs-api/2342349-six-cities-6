import {BaseCommand} from '#src/cli/commands/base-command.js';
import {OfferParser} from '#src/offers/parser/offer-parser.interface.js';
import {FileReader} from '#src/offers/reader/file-reader.interface.js';
import {Component} from '#src/types/component.enum.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {DatabaseClient} from '#src/utils/database-client/database-client.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {inject, injectable} from 'inversify';

interface DbParams {
  dbUser?: string;
  dbPassword?: string;
  dbHost?: string;
  dbPort?: string;
  dbName?: string;
}

@injectable()
export class ImportCommand extends BaseCommand {
  readonly _name: string = '--import';

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
    const {fileList, dbParams} = this.parseInput(parameters);
    this.validateInput(fileList, dbParams);
    this.logger.info('Init database...');
    await this.initDb(dbParams);
    this.logger.info('Init database completed');
    await this.parseFileList(fileList);
    await this.databaseClient.disconnect();
  }

  private parseInput(input: string[]): { fileList: string[], dbParams: DbParams } {
    const dbParamRegex = /-db-(user|password|host|port|name)/;
    const dbParams: Partial<DbParams> = {};
    const fileList: string[] = [];

    let index = 0;
    while (index < input.length) {
      const key = input[index];
      const match = dbParamRegex.exec(key);
      if (key.startsWith('-db-')) {
        if (match) {
          const dbKey = `db${match[1].charAt(0).toUpperCase() + match[1].slice(1)}` as keyof DbParams;
          if ((index + 1) < input.length) {
            dbParams[dbKey] = input[index + 1];
            this.logger.info(`Read '${dbKey}' from console`);
            index++;
          } else {
            throw new Error(`Value for ${dbKey} is missing`);
          }
        }
      } else {
        fileList.push(key);
      }
      index++;
    }
    return {fileList, dbParams};
  }

  private validateInput(fileList: string[], dbParams: Partial<DbParams>): void {
    if (fileList.length === 0) {
      throw new Error('At least one "Filepath" is required.');
    }
    if (fileList.some((filePath) => !filePath.trim())) {
      throw new Error('All file paths must be non-empty strings.');
    }

    const requiredDbParams: (keyof DbParams)[] = ['dbUser', 'dbPassword', 'dbHost', 'dbPort', 'dbName'];
    if (Object.keys(dbParams).length && requiredDbParams.some((key) => dbParams[key] === undefined)) {
      throw new Error('All database parameters must be provided.');
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

  private async initDb(dbParams: DbParams): Promise<void> {
    const dbUri = this.databaseClient.getURI(
      dbParams?.dbUser ?? this.config.get('DB_USER'),
      dbParams?.dbPassword ?? this.config.get('DB_PASSWORD'),
      dbParams?.dbHost ?? this.config.get('DB_HOST'),
      dbParams?.dbPort ?? this.config.get('DB_PORT'),
      dbParams?.dbName ?? this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(
      dbUri,
      this.config.get('DB_RETRY_COUNT'),
      this.config.get('DB_RETRY_TIMEOUT')
    );
  }
}
