import {LocationValidationConstant} from '#src/modules/location/validation/location-validation.constant.js';

export const LocationValidationMessage = {
  latitude: {
    isNumber: 'Latitude must be a number',
    min: `Latitude must be at least ${LocationValidationConstant.latitude.min}`,
    max: `Latitude must be no more than ${LocationValidationConstant.latitude.max}`,
  },
  longitude: {
    isNumber: 'Longitude must be a number',
    min: `Longitude must be at least ${LocationValidationConstant.longitude.min}`,
    max: `Longitude must be no more than ${LocationValidationConstant.longitude.max}`,
  },
};
