import {UserService} from '#src/rest/modules/user/user-service.interface.js';
import {UserEntity} from '#src/rest/modules/user/user.entity.js';
import {User} from '#src/rest/modules/user/user.type.js';
import {Component} from '#src/types/component.enum.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {CryptoProtocol} from '#src/utils/crypto/crypto.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.Crypto) private readonly cryptoProtocol: CryptoProtocol,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
  }

  public async findByMail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(userData: User): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByMail(userData.email);
    if (existedUser) {
      return existedUser;
    }

    return this.create(userData);
  }

  private async create(userData: User): Promise<DocumentType<UserEntity>> {
    const passwordHash = await this.cryptoProtocol.hashPassword(userData.password);
    const user = new UserEntity(userData, passwordHash, this.config.get('AVATAR_DEFAULT_URL'));
    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }
}
