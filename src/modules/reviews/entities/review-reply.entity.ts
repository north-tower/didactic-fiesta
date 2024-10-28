// src/modules/reviews/entities/review-reply.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { Review } from './review.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('review_replies')
export class ReviewReply extends BaseEntity {
  @Column({ type: 'uuid' })
  reviewId: string;

  @ManyToOne(() => Review, (review) => review.replies)
  review: Review;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'text' })
  comment: string;

  @Column({ default: false })
  isOfficial: boolean;

  @Column({ default: 0 })
  helpfulCount: number;
}
