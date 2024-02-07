import {ReviewEntity} from '#src/rest/modules/review/review.entity.js';
import {Review} from '#src/rest/modules/review/review.type.js';
import {DocumentType} from '@typegoose/typegoose';

export interface ReviewService {
  fineOrCreate(reviewData: Review): Promise<DocumentType<ReviewEntity>>;

  findById(id: number): Promise<DocumentType<ReviewEntity> | null>;
}
