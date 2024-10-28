// src/modules/reviews/entities/review-summary.entity.ts
import { Entity, Column } from 'typeorm';
import { RatingMetric, ReviewType } from 'src/common/enums/app.enum';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('review_summaries')
export class ReviewSummary extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ReviewType,
  })
  type: ReviewType;

  @Column({ type: 'uuid' })
  entityId: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  averageRating: number;

  @Column()
  totalReviews: number;

  @Column({ type: 'json' })
  ratingDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };

  @Column({ type: 'json' })
  metricAverages: {
    [key in RatingMetric]?: number;
  };

  @Column({ type: 'json', nullable: true })
  metadata: {
    verifiedPurchaseCount?: number;
    withImagesCount?: number;
    withRepliesCount?: number;
    lastUpdated?: Date;
  };
}
