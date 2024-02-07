import {Component} from '#src/types/component.enum.js';
import {DbParam} from '#src/types/db-param.type.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {DatabaseClient} from '#src/utils/database-client/database-client.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {inject, injectable} from 'inversify';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
  ) {
  }

  public async init(): Promise<void> {
    this.logger.info('Application initialization');
    this.logger.info(`env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this.initDb();
    this.logger.info('Init database completed');
  }

  private async initDb(): Promise<void> {
    const dbParamVerified: DbParam = {
      dbUser: this.config.get('DB_USER'),
      dbPassword: this.config.get('DB_PASSWORD'),
      dbHost: this.config.get('DB_HOST'),
      dbPort: this.config.get('DB_PORT'),
      dbName: this.config.get('DB_NAME')
    };
    const dbUri = this.databaseClient.getURI(dbParamVerified);

    return this.databaseClient.connect(
      dbUri,
      this.config.get('DB_RETRY_COUNT'),
      this.config.get('DB_RETRY_TIMEOUT')
    );
  }
}
