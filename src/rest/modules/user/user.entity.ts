import {User, UserType} from '#src/rest/modules/user/user.type.js';
import {EntityConfig} from '#src/utils/config.constants.js';
import {defaultClasses, getModelForClass, modelOptions, prop} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true, trim: true})
  public name: string;

  @prop({required: true, trim: true, unique: true})
  public email: string;

  @prop({required: true, trim: true})
  public avatarUrl: string;

  @prop({required: true, trim: true})
  public password: string;

  @prop({required: true, enum: UserType})
  public type: UserType;

  @prop({required: true, type: [String]})
  public favoriteOffers: string[] = [];

  constructor(
    userData: User,
    passwordHash: string
  ) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl ?? EntityConfig.AVATAR_DEFAULT_URL;
    this.type = userData.type;
    this.password = passwordHash;
  }
}

export const UserModel = getModelForClass(UserEntity);
