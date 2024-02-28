import {CreateOfferDTO} from '#src/modules/offer/dto/create-offer.dto.js';
import {OfferRDO} from '#src/modules/offer/dto/offer.rdo.js';
import {UpdateOfferDTO} from '#src/modules/offer/dto/update-offer.dto.js';
import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {ParamOfferId} from '#src/modules/offer/type/param-offerid.type.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {BaseController} from '#src/rest/controller/base-controller.abstract.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {DocumentExistsMiddleware} from '#src/rest/middleware/document-exists.middleware.js';
import {PrivateRouteMiddleware} from '#src/rest/middleware/private-route.middleware.js';
import {ValidateDtoMiddleware} from '#src/rest/middleware/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '#src/rest/middleware/validate-objectid.middleware.js';
import {Component} from '#src/type/component.enum.js';
import {HttpMethod} from '#src/type/http-method.enum.js';
import {RequestBody} from '#src/type/request-body.type.js';
import {RequestParams} from '#src/type/request.params.type.js';
import {fillDTO} from '#src/utils/dto.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Ref} from '@typegoose/typegoose';
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
      path: '/favorites',
      handler: this.getFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/premium',
      handler: this.getPremium
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/',
      handler: this.index
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/',
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDTO)
      ]
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/:offerId',
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      method: HttpMethod.Patch,
      path: '/:offerId',
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDTO),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      method: HttpMethod.Delete,
      path: '/:offerId',
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
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

  public async create(
    {body, tokenPayload}: Request<RequestParams, RequestBody, CreateOfferDTO>,
    res: Response
  ): Promise<void> {
    const userIdRef = tokenPayload.id as unknown as Ref<UserEntity>;

    const createdOffer = await this.offerService.create(userIdRef, body);
    this.created(res, fillDTO(OfferRDO, createdOffer));
  }

  public async show({params}: Request<ParamOfferId>, res: Response): Promise<void> {
    const offerIdRef = params.offerId as unknown as Ref<OfferEntity>;

    const offer = await this.offerService.findById(offerIdRef);
    this.ok(res, fillDTO(OfferRDO, offer));
  }

  public async update(
    {body, params}: Request<ParamOfferId, RequestBody, UpdateOfferDTO>,
    res: Response
  ): Promise<void> {
    const offerIdRef = params.offerId as unknown as Ref<OfferEntity>;

    const offer = await this.offerService.updateById(offerIdRef, body);
    this.ok(res, fillDTO(OfferRDO, offer));
  }

  public async delete(
    {params}: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const offerIdRef = params.offerId as unknown as Ref<OfferEntity>;

    const offer = await this.offerService.deleteById(offerIdRef);
    this.ok(res, fillDTO(OfferRDO, offer));
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
    this.ok(res, fillDTO(OfferRDO, offers));
  }

  public async getFavorites(
    {tokenPayload, query}: Request,
    res: Response
  ): Promise<void> {
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : undefined;
    if (limit && isNaN(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The \'limit\' parameter must be a valid number.',
        'FavoriteController'
      );
    }
    const userIdRef = tokenPayload.id as unknown as Ref<UserEntity>;

    const shortOfferRDOs = await this.offerService.findFavorites(userIdRef, limit);
    this.ok(res, shortOfferRDOs);
  }
}
