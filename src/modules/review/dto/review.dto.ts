import {CreateReviewDto} from '#src/modules/review/dto/create-review.dto.js';

export class ReviewDTO extends CreateReviewDto {
  public publishDate: Date;

  constructor(publishDate: Date) {
    super();
    this.publishDate = publishDate ?? new Date();
  }
}
