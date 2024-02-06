import {UserType} from '#src/utils/modules/user/user.type.js';

export class CreateUserDto {
  constructor(
    public name: string,
    public password: string,
    public email: string,
    public type: UserType,
    public avatarUrl?: string
  ) {
  }
}
