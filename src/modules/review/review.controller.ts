import {ParamOfferId} from '#src/modules/offer/type/param-offerid.type.js';
import {CreateReviewDto} from '#src/modules/review/dto/create-review.dto.js';
import {ReviewRdo} from '#src/modules/review/dto/review.rdo.js';
import {ReviewService} from '#src/modules/review/service/review-service.interface.js';
import {BaseController} from '#src/rest/controller/base-controller.abstract.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Component} from '#src/types/component.enum.js';
import {HttpMethod} from '#src/types/http-method.enum.js';
import {RequestBody} from '#src/types/request-body.type.js';
import {fillDTO} from '#src/utils/dto.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';


@injectable()
export class ReviewController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService,
  ) {
    super(logger);

    this.logger.info('Register routes for ReviewController...');
    this.addRoute({
      method: HttpMethod.Get,
      path: '/:offerId',
      handler: this.show
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/:offerId',
      handler: this.create
    });

  }

  public async show({params, query}: Request<ParamOfferId>, res: Response): Promise<void> {
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : undefined;

    if (limit && isNaN(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The \'limit\' parameter must be a valid number.',
        'ReviewController'
      );
    }

    const reviews = await this.reviewService.findByOffer(params.offerId, limit);
    this.ok(res, fillDTO(ReviewRdo, reviews));
  }

  public async create({
    body,
    params
  }: Request<ParamOfferId, RequestBody, CreateReviewDto>, res: Response): Promise<void> {
    const createdReview = await this.reviewService.create(params.offerId, body);
    this.created(res, fillDTO(ReviewRdo, createdReview));
  }
}
