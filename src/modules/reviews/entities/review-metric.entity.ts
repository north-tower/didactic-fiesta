// src/modules/reviews/entities/review-metric.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { Review } from './review.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { RatingMetric } from 'src/common/enums/app.enum';

@Entity('review_metrics')
export class ReviewMetric extends BaseEntity {
  @Column({ type: 'uuid' })
  reviewId: string;

  @ManyToOne(() => Review, (review) => review.metrics)
  review: Review;

  @Column({
    type: 'enum',
    enum: RatingMetric,
  })
  metric: RatingMetric;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;
}
