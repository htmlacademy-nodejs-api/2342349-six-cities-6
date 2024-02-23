import {ReviewValidationConstant} from '#src/modules/review/validation/review-validation.constant.js';

export const ReviewValidationMessage = {
  comment: {
    isString: 'Comment must be a string',
    length: `Comment must be between ${ReviewValidationConstant.comment.minLength} and ${ReviewValidationConstant.comment.maxLength} characters`,
  },
  rating: {
    isNumber: 'Rating must be a number',
    min: `Rating must be at least ${ReviewValidationConstant.rating.min}`,
    max: `Rating must be no more than ${ReviewValidationConstant.rating.max}`,
  }
};
