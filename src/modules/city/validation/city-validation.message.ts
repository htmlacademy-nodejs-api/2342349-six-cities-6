import {CityValidationConstant} from '#src/modules/city/validation/city-validation.constant.js';

export const CityValidationMessage = {
  name: {
    isString: 'City name must be a string',
    length: `City name must be between ${CityValidationConstant.name.minLength} and ${CityValidationConstant.name.maxLength} characters`,
  },
  location: 'Location validation failed',
};
