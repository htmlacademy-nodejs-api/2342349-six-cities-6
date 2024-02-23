import {UserType} from '#src/modules/user/type/user.type.js';
import {UserValidationConstant} from '#src/modules/user/validation/user-validation.constant.js';
import {UserValidationMessage} from '#src/modules/user/validation/user-validation.message.js';
import {IsEmail, IsEnum, IsOptional, IsString, IsUrl, Length, Matches} from 'class-validator';

export class UserValidation {
  @IsString({message: UserValidationMessage.name.isString})
  @Length(UserValidationConstant.name.minLength, UserValidationConstant.name.maxLength, {message: UserValidationMessage.name.length})
  public name!: string;

  @IsEmail({}, {message: UserValidationMessage.email.isEmail})
  public email!: string;

  @IsUrl({}, {message: UserValidationMessage.avatarUrl.isUrl})
  @IsOptional()
  @Matches(UserValidationConstant.avatarUrlPattern, {message: UserValidationMessage.avatarUrl.pattern})
  public avatarUrl?: string;

  @IsString({message: UserValidationMessage.password.isString})
  @Length(UserValidationConstant.password.minLength, UserValidationConstant.password.maxLength, {message: UserValidationMessage.password.length})
  public password!: string;

  @IsEnum(UserType, {message: UserValidationMessage.type.isEnum})
  public type!: UserType;
}
