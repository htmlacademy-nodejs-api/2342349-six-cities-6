import {FavoriteService} from '#src/modules/favorite/service/favorite-service.interface.js';
import {ParamOfferId} from '#src/modules/offer/type/param-offerid.type.js';
import {BaseController} from '#src/rest/controller/base-controller.abstract.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Component} from '#src/types/component.enum.js';
import {HttpMethod} from '#src/types/http-method.enum.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';


@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.FavoriteService) private readonly favoriteService: FavoriteService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController...');
    this.addRoute({
      method: HttpMethod.Get,
      path: '/',
      handler: this.index
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/:offerId',
      handler: this.create
    });
    this.addRoute({
      method: HttpMethod.Delete,
      path: '/:offerId',
      handler: this.delete
    });
  }

  public async index({query}: Request, res: Response): Promise<void> {
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : undefined;
    //todo JWT
    const userId = query.userId as string;

    if (limit && isNaN(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The \'limit\' parameter must be a valid number.',
        'FavoriteController'
      );
    }

    const shortOfferRDOs = await this.favoriteService.findByUser(userId, limit);
    this.ok(res, shortOfferRDOs);
  }

  public async create({params, query}: Request<ParamOfferId>, res: Response): Promise<void> {
    //todo JWT
    const userId = query.userId as string;

    await this.favoriteService.addByOfferId(params.offerId, userId);
    this.created(res, {});
  }

  public async delete({params, query}: Request<ParamOfferId>, res: Response): Promise<void> {
    //todo JWT
    const userId = query.userId as string;

    await this.favoriteService.deleteByOfferId(params.offerId, userId);
    this.noContent(res, {});
  }
}
