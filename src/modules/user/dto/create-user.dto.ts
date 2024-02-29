import {UserType} from '#src/modules/user/type/user.type.js';
import {USERVALIDATIONCONSTANT} from '#src/modules/user/validation/user-validation.constant.js';
import {IsEmail, IsEnum, IsString, Length} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @Length(USERVALIDATIONCONSTANT.NAME.MINLENGTH, USERVALIDATIONCONSTANT.NAME.MAXLENGTH)
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsString()
  @Length(USERVALIDATIONCONSTANT.PASSWORD.MINLENGTH, USERVALIDATIONCONSTANT.PASSWORD.MAXLENGTH)
  public password!: string;

  @IsEnum(UserType)
  public type!: UserType;
}
