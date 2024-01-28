import {Component} from '#src/types/component.enum.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {inject, injectable} from 'inversify';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`env $PORT: ${this.config.get('PORT')}`);
  }
}
