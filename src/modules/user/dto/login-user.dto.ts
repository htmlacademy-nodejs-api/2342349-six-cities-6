import {UserValidationConstant} from '#src/modules/user/validation/user-validation.constant.js';
import {UserValidationMessage} from '#src/modules/user/validation/user-validation.message.js';
import {IsEmail, IsString, Length} from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, {message: UserValidationMessage.email.isEmail})
  public email!: string;

  @IsString({message: UserValidationMessage.password.isString})
  @Length(UserValidationConstant.password.minLength, UserValidationConstant.password.maxLength, {message: UserValidationMessage.password.length})
  public password!: string;
}
