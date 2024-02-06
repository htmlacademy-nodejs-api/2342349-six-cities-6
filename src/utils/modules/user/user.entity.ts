import {User, UserType} from '#src/utils/modules/user/user.type.js';
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
// export class UserEntity {
  // todo type: String
  @prop({required: true, trim: true, type: String})
  public name: string;

  @prop({required: true, trim: true, unique: true, type: String})
  public email: string;

  @prop({required: true, trim: true, type: String})
  public avatarUrl: string;

  @prop({required: true, trim: true, type: String})
  public password: string;

  @prop({required: true, enum: UserType, type: String})
  public type: UserType;

  constructor(userData: User, hashPassword: string) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    // todo url - хотел иньекцию но как передавать? или отдельным параметром закидывать в класс при создании экземпляра
    this.avatarUrl = userData.avatarUrl ?? 'url';
    this.type = userData.type;
    // todo доп параметр hashPassword
    this.password = hashPassword;
  }
}

export const UserModel = getModelForClass(UserEntity);
