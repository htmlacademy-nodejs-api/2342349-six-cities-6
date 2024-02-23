import {CreateOfferDto} from '#src/modules/offer/dto/create-offer.dto.js';
import {OfferRdo} from '#src/modules/offer/dto/offer.rdo.js';
import {UpdateOfferDto} from '#src/modules/offer/dto/update-offer.dto.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {ParamOfferId} from '#src/modules/offer/type/param-offerid.type.js';
import {BaseController} from '#src/rest/controller/base-controller.abstract.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {ValidateDtoMiddleware} from '#src/rest/middleware/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '#src/rest/middleware/validate-objectid.middleware.js';
import {Component} from '#src/types/component.enum.js';
import {HttpMethod} from '#src/types/http-method.enum.js';
import {RequestBody} from '#src/types/request-body.type.js';
import {RequestParams} from '#src/types/request.params.type.js';
import {fillDTO} from '#src/utils/dto.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');
    this.addRoute({
      method: HttpMethod.Get,
      path: '/',
      handler: this.index
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/',
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/:offerId',
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
    this.addRoute({
      method: HttpMethod.Patch,
      path: '/:offerId',
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto)
      ]
    });
    this.addRoute({
      method: HttpMethod.Delete,
      path: '/:offerId',
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/premium',
      handler: this.getPremium
    });
  }

  public async index({query}: Request, res: Response): Promise<void> {
    const cityId = typeof query.cityId === 'string' ? query.cityId : undefined;
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : undefined;

    if (limit && isNaN(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The \'limit\' parameter must be a valid number.',
        'OfferController'
      );
    }

    const shortOfferRDOs = await this.offerService.findShorts(cityId, limit);
    this.ok(res, shortOfferRDOs);
  }

  public async create({body}: Request<RequestParams, RequestBody, CreateOfferDto>, res: Response): Promise<void> {
    const createdOffer = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, createdOffer));
  }

  public async show({params}: Request<ParamOfferId>, res: Response): Promise<void> {
    const offer = await this.offerService.find(params.offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update({
    body,
    params
  }: Request<ParamOfferId, RequestBody, UpdateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete({params}: Request<ParamOfferId>, res: Response): Promise<void> {
    const offer = await this.offerService.deleteById(params.offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async getPremium({query}: Request, res: Response): Promise<void> {
    const cityId = typeof query.cityId === 'string' ? query.cityId : undefined;
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : undefined;

    if (!cityId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The \'cityId\' parameter must be a present.',
        'OfferController'
      );
    }

    if (limit && isNaN(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The \'limit\' parameter must be a valid number.',
        'OfferController'
      );
    }

    const offers = await this.offerService.findPremiumByCity(cityId, limit);
    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
