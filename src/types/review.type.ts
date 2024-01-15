import {User} from './user.type.js';

export type Review = {
  comment: string,
  publishDate: Date,
  rating: number,
  author: User
}
