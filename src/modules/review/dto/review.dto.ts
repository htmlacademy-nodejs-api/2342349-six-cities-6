import {CreateReviewDTO} from '#src/modules/review/dto/create-review.dto.js';

export class ReviewDTO extends CreateReviewDTO {
  public publishDate: Date;

  constructor(publishDate: Date) {
    super();
    this.publishDate = publishDate;
  }
}
