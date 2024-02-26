import {AuthService} from '#src/modules/auth/auth-service.interface.js';
import {TokenPayload} from '#src/modules/auth/type/token-payload.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {AuthConfig} from '#src/rest/config.constant.js';
import {UserNotFoundException} from '#src/rest/errors/user-not-found.exception.js';
import {UserPasswordHashingException} from '#src/rest/errors/user-password-hashing-exception.js';
import {UserPasswordIncorrectException} from '#src/rest/errors/user-password-incorrect.exception.js';
import {Component} from '#src/types/component.enum.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {CryptoProtocol} from '#src/utils/crypto/crypto.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {inject, injectable} from 'inversify';
import {SignJWT} from 'jose';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.Crypto) private readonly cryptoProtocol: CryptoProtocol,
  ) {
  }

  public async authenticate(user: UserEntity): Promise<string> {
    const tokenPayload: TokenPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({alg: AuthConfig.JWT_ALGORITHM})
      .setIssuedAt()
      .setExpirationTime(AuthConfig.JWT_EXPIRED)
      .sign(Buffer.from(this.config.get('JWT_SECRET')));
  }

  public async verify(inputLogin: string, inputPassword: string, existingUser: UserEntity | null): Promise<UserEntity> {
    if (!existingUser) {
      this.logger.warn(`User with ${inputLogin} not found`);
      throw new UserNotFoundException('AuthService');
    }

    const isPasswordValid = await this.cryptoProtocol.verifyPassword(existingUser.password, inputPassword);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user ${existingUser.email}`);
      throw new UserPasswordIncorrectException('AuthService');
    }
    return existingUser;
  }

  public async encryptInputPassword(inputPassword: string): Promise<string> {
    const hashedPassword = await this.cryptoProtocol.hashPassword(inputPassword);
    if (!hashedPassword) {
      this.logger.warn('Can not create hash password for user');
      throw new UserPasswordHashingException('AuthService');
    }
    return hashedPassword;
  }
}