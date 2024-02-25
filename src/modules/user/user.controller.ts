import {CreateUserDto} from '#src/modules/user/dto/create-user.dto.js';
import {LoggedUserRdo} from '#src/modules/user/dto/logged-user.rdo.js';
import {LoginUserDto} from '#src/modules/user/dto/login-user.dto.js';
import {UserRdo} from '#src/modules/user/dto/user.rdo.js';
import {UserService} from '#src/modules/user/service/user-service.interface.js';
import {ParamUserId} from '#src/modules/user/type/param-userid.type.js';
import {BaseController} from '#src/rest/controller/base-controller.abstract.js';
import {DocumentExistsMiddleware} from '#src/rest/middleware/document-exists.middleware.js';
import {UploadFileMiddleware} from '#src/rest/middleware/upload-file.middleware.js';
import {ValidateDtoMiddleware} from '#src/rest/middleware/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '#src/rest/middleware/validate-objectid.middleware.js';
import {Component} from '#src/types/component.enum.js';
import {HttpMethod} from '#src/types/http-method.enum.js';
import {RequestBody} from '#src/types/request-body.type.js';
import {RequestParams} from '#src/types/request.params.type.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {fillDTO} from '#src/utils/dto.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController...');
    this.addRoute({
      method: HttpMethod.Post,
      path: '/',
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/login',
      handler: this.isLogin,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/login',
      handler: this.login
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/logout',
      handler: this.logout
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/:userId/avatar',
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar')
      ]
    });
  }

  public async create({body}: Request<RequestParams, RequestBody, CreateUserDto>, res: Response): Promise<void> {
    const createdUser = await this.userService.create(body);
    this.created(res, fillDTO(UserRdo, createdUser));
  }

  private async login({body}: Request<RequestParams, RequestBody, LoginUserDto>, res: Response): Promise<void> {
    const authenticatedUserToken = await this.userService.login(body.email, body.password);
    const responseData = fillDTO(LoggedUserRdo, {
      email: body.email,
      token: authenticatedUserToken,
    });
    this.ok(res, responseData);
  }

  private async isLogin(_req: Request, res: Response): Promise<void> {
    const isSuccess = await this.userService.isLoggedIn();
    this.ok(res, isSuccess);
  }

  private async logout(_req: Request, res: Response): Promise<void> {
    const isSuccess = await this.userService.isLoggedIn();
    this.ok(res, isSuccess);
  }

  public async uploadAvatar(req: Request<ParamUserId>, res: Response): Promise<void> {
    console.log(`uploadAvatar '${req.params.userId}'`);
    this.created(res, {
      filepath: req.file?.path,
      userId: req.params.userId
    });
  }
}
