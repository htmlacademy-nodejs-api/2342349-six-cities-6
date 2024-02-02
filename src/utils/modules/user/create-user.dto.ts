import {UserType} from '#src/types/user.type.js';

export class CreateUserDto {
  public name: string;
  public password: string;
  public email: string;
  public avatarUrl?: string;
  public type: UserType;
}
