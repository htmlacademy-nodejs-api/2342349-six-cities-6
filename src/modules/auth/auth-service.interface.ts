import {UserEntity} from '#src/modules/user/user.entity.js';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;

  verify(inputLogin: string, inputPassword: string, existingUser: UserEntity | null): Promise<UserEntity>;

  encryptInputPassword(inputPassword: string): Promise<string>;
}
