import {User} from '#src/rest/modules/user/user.type.js';

export interface Review {
  comment: string,
  publishDate: Date,
  rating: number,
  author: User
}
