export const LISTLIMITSCONFIG = {
  REVIEW_LIST_LIMIT: 50,
  CITY_LIST_LIMIT: 50,
  OFFERS_LIST_LIMIT: 300,
  OFFERS_LIST_LIMIT_DEFAULT: 60,
  PREMIUM_LIST_LIMIT: 3,
  FAVORITE_LIST_LIMIT: 60,
};

export const ENTITY_PROFILE_CONFIG = {
  DEFAULT_USER_AVATAR_URL: 'default-user-avatar.jpg',
  DEFAULT_OFFER_PREVIEW_URL: 'default-offer-preview.jpg',
  DEFAULT_OFFER_GALLERY_URL: 'default-offer-gallery.jpg',
};

export const SERVER_CONFIG = {
  STATIC_UPLOAD_ROUTE: '/upload',
  STATIC_FILES_ROUTE: '/static',
  DEFAULT_STATIC_IMAGES: [
    'default-user-avatar.jpg',
    'default-offer-preview.jpg',
    'default-offer-gallery.jpg',
  ],
  STATIC_RESOURCE_FIELDS: [
    'avatarUrl',
    'previewImage',
    'images'
  ]
};
