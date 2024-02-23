export const OfferValidationConstant = {
  title: {
    minLength: 10,
    maxLength: 100,
  },
  description: {
    minLength: 20,
    maxLength: 1024,
  },
  images: {
    minCount: 6,
    maxCount: 6,
  },
  room: {
    min: 1,
    max: 8,
  },
  bedroom: {
    min: 1,
    max: 10,
  },
  price: {
    min: 100,
    max: 100000,
  },
  rating: {
    min: 100,
    max: 100000,
  },
};
