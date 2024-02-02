import {User, UserType} from '#src/types/user.type.js';
import {createSHA} from '#src/utils/crypto.js';
import {defaultClasses, getModelForClass, prop} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true, default: ''})
  public name: string;

  @prop({unique: true, required: true})
  public email: string;

  @prop({required: true, default: ''})
  public avatarUrl?: string;

  // todo
  @prop({required: true})
  public type: UserType;

  @prop({required: true, default: ''})
  private password?: string;

  constructor(userData: User, salt: string) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl;
    this.type = userData.type;
    // todo
    this.password = userData.password;
    this.setPassword(userData.password, salt);
  }


  public setPassword(password: string, salt: string) {
    this.password = createSHA(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
