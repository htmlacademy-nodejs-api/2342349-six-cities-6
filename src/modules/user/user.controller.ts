import {CreateUserDto} from '#src/modules/user/dto/create-user.dto.js';
import {LoginUserDto} from '#src/modules/user/dto/login-user.dto.js';
import {UserRdo} from '#src/modules/user/dto/user.rdo.js';
import {UserService} from '#src/modules/user/service/user-service.interface.js';
import {BaseController} from '#src/rest/controller/base-controller.abstract.js';
import {Component} from '#src/types/component.enum.js';
import {HttpMethod} from '#src/types/http-method.enum.js';
import {RequestBody} from '#src/types/request-body.type.js';
import {RequestParams} from '#src/types/request.params.type.js';
import {fillDTO} from '#src/utils/dto.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController...');
    this.addRoute({
      method: HttpMethod.Post,
      path: '/',
      handler: this.create
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/login',
      handler: this.isLogin
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
  }

  public async create({body}: Request<RequestParams, RequestBody, CreateUserDto>, res: Response): Promise<void> {
    const createdUser = await this.userService.create(body);
    this.created(res, fillDTO(UserRdo, createdUser));
  }

  private async login({body}: Request<RequestParams, RequestBody, LoginUserDto>, res: Response): Promise<void> {
    const isSuccess = await this.userService.login(body.email, body.password);
    this.ok(res, isSuccess);
  }

  private async isLogin(_req: Request, res: Response): Promise<void> {
    const isSuccess = await this.userService.isLogin();
    this.ok(res, isSuccess);
  }

  private async logout(_req: Request, res: Response): Promise<void> {
    const isSuccess = await this.userService.isLogin();
    this.ok(res, isSuccess);
  }
}
