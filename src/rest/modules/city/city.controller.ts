import {BaseController} from '#src/rest/controller/base-controller.abstract.js';
import {CityRdo} from '#src/rest/modules/city/dto/city.rdo.js';
import {CityService} from '#src/rest/modules/city/service/city-service.interface.js';
import {Component} from '#src/types/component.enum.js';
import {HttpMethod} from '#src/types/http-method.enum.js';
import {fillDTO} from '#src/utils/dto.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';

@injectable()
export class CityController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CityService) private readonly cityService: CityService,
  ) {
    super(logger);

    this.logger.info('Register routes for CityController...');
    this.addRoute({
      method: HttpMethod.Get,
      path: '/',
      handler: this.index
    });

  }

  public async index(_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.getAllCities();
    this.ok(res, fillDTO(CityRdo, cities));
  }
}
