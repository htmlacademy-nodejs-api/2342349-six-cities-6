import {User} from '#src/types/user.type.js';

export interface Review {
  comment: string,
  publishDate: Date,
  rating: number,
  author: User
}
