import {Controller} from '#src/rest/controller/controller.interface.js';
import {AuthExceptionFilter} from '#src/rest/exception-filter/auth.exception-filter.js';
import {ExceptionFilter} from '#src/rest/exception-filter/exception-filter.interface.js';
import {ParseTokenMiddleware} from '#src/rest/middleware/parse-token.middleware.js';
import {Component} from '#src/types/component.enum.js';
import {DbParam} from '#src/types/db-param.type.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {DatabaseClient} from '#src/utils/database-client/database-client.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import express, {Express} from 'express';
import {inject, injectable} from 'inversify';

@injectable()
export class RestApplication {
  private readonly apiVersion = '/api/v1';
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: AuthExceptionFilter,
    @inject(Component.CityController) private readonly cityController: Controller,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.ReviewController) private readonly reviewController: Controller,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.FavoriteController) private readonly favoriteController: Controller,
  ) {
    this.server = express();
  }

  public async init(): Promise<void> {
    this.logger.info('Application initialization');

    this.logger.info('Init database...');
    await this.initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init app-level middleware...');
    await this.initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controller...');
    await this.initController();
    this.logger.info('Init controller completed');

    this.logger.info('Init exception filters...');
    await this.initExceptionFilters();
    this.logger.info('Exception filters initialization completed');

    this.logger.info('Init server...');
    await this.initServer();
    this.logger.info('Init server completed');

    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
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

  private async initServer(): Promise<void> {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async initMiddleware(): Promise<void> {
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(express.json());
    this.server.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
  }

  private async initExceptionFilters(): Promise<void> {
    this.server.use(this.authExceptionFilter.catch.bind(this.appExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  private async initController(): Promise<void> {
    this.server.use(`${this.apiVersion}/cities`, this.cityController.router);
    this.server.use('/cities', this.cityController.router);

    this.server.use(`${this.apiVersion}/offers`, this.offerController.router);
    this.server.use('/offers', this.offerController.router);

    this.server.use(`${this.apiVersion}/comments`, this.reviewController.router);
    this.server.use('/comments', this.reviewController.router);

    this.server.use(`${this.apiVersion}/users`, this.userController.router);
    this.server.use('/users', this.userController.router);

    this.server.use(`${this.apiVersion}/favorites`, this.favoriteController.router);
    this.server.use('/favorites', this.favoriteController.router);
  }
}
