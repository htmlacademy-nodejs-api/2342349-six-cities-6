import {UserValidationConstant} from '#src/modules/user/validation/user-validation.constant.js';

export const UserValidationMessage = {
  name: {
    isString: 'Name must be a string',
    length: `Name must be between ${UserValidationConstant.name.minLength} and ${UserValidationConstant.name.maxLength} characters`,
  },
  email: {
    isEmail: 'Email must be a valid email address',
  },
  avatarUrl: {
    isUrl: 'Avatar URL must be a valid URL',
    isOptional: 'Avatar URL is optional',
    pattern: 'Avatar URL must be in .jpg, .jpeg, or .png format',
  },
  password: {
    isString: 'Password must be a string',
    length: `Password must be between ${UserValidationConstant.password.minLength} and ${UserValidationConstant.password.maxLength} characters`,
  },
  type: {
    isEnum: 'Type must be a valid user type',
  },
};
