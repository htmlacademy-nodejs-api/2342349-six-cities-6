import {OfferValidationConstant} from '#src/modules/offer/validation/offer-validation.constant.js';

export const OfferValidationMessage = {
  title: {
    isString: 'Title must be a string',
    length: `Title must be between ${OfferValidationConstant.title.minLength} and ${OfferValidationConstant.title.maxLength} characters`,
  },
  description: {
    isString: 'Description must be a string',
    length: `Description must be between ${OfferValidationConstant.description.minLength} and ${OfferValidationConstant.description.maxLength} characters`,
  },
  publicDate: {
    isDateString: 'Public date must be a valid date string',
  },
  previewImage: {
    isUrl: 'Preview image must be a valid URL',
  },
  images: {
    isArray: 'Images must be an array',
    arrayMinSize: `There must be at least ${OfferValidationConstant.images.minCount} images`,
    arrayMaxSize: `There must be no more than ${OfferValidationConstant.images.maxCount} images`,
    isUrl: 'Each image must be a valid URL',
  },
  isPremium: {
    isBoolean: 'IsPremium must be a boolean value',
  },
  isFavorite: {
    isBoolean: 'IsFavorite must be a boolean value',
  },
  rating: {
    isNumber: 'Rating must be a number',
    min: `Rating must be at least ${OfferValidationConstant.rating.min}`,
    max: `Rating must be no more than ${OfferValidationConstant.rating.max}`,
  },
  type: {
    isEnum: 'Type must be a valid enum value',
  },
  room: {
    isNumber: 'Room must be a number',
    min: `Room must be at least ${OfferValidationConstant.room.min}`,
    max: `Room must be no more than ${OfferValidationConstant.room.max}`,
  },
  bedroom: {
    isNumber: 'Bedroom must be a number',
    min: `Bedroom must be at least ${OfferValidationConstant.bedroom.min}`,
    max: `Bedroom must be no more than ${OfferValidationConstant.bedroom.max}`,
  },
  price: {
    isNumber: 'Price must be a number',
    min: `Price must be at least ${OfferValidationConstant.price.min}`,
    max: `Price must be no more than ${OfferValidationConstant.price.max}`,
  },
  goods: {
    isArray: 'Goods must be an array',
    isString: 'Each good must be a string',
  }
};
