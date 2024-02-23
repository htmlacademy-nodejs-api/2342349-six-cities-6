export const UserValidationConstant = {
  name: {
    minLength: 1,
    maxLength: 15,
  },
  password: {
    minLength: 6,
    maxLength: 12,
  },
  avatarUrlPattern: /\.(jpg|jpeg|png)$/i
};
