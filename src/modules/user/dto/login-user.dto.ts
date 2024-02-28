import {USERVALIDATIONCONSTANT} from '#src/modules/user/validation/user-validation.constant.js';
import {IsEmail, IsString, Length} from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  public email!: string;

  @IsString()
  @Length(USERVALIDATIONCONSTANT.PASSWORD.MINLENGTH, USERVALIDATIONCONSTANT.PASSWORD.MAXLENGTH)
  public password!: string;
}
