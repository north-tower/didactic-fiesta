// src/modules/reviews/entities/review.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { ReviewStatus, ReviewType } from 'src/common/enums/app.enum';
import { Media } from 'src/modules/media/entities/media.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Seller } from 'src/modules/sellers/entities/seller.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ReviewMetric } from './review-metric.entity';
import { ReviewReply } from './review-reply.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: ReviewType,
  })
  type: ReviewType;

  @Column({ type: 'uuid' })
  entityId: string; // Product or Seller ID

  @ManyToOne(() => Product, {
    nullable: true,
  })
  product: Product;

  @ManyToOne(() => Seller, {
    nullable: true,
  })
  seller: Seller;

  @Column({ type: 'uuid', nullable: true })
  orderId: string;

  @ManyToOne(() => Order, {
    nullable: true,
  })
  order: Order;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING,
  })
  status: ReviewStatus;

  @Column({ default: 0 })
  helpfulCount: number;

  @Column({ default: 0 })
  reportCount: number;

  @Column({ type: 'boolean', default: false })
  isVerifiedPurchase: boolean;

  @OneToMany(() => Media, (media) => media.entityId)
  images: Media[];

  @OneToMany(() => ReviewMetric, (metric) => metric.review)
  metrics: ReviewMetric[];

  @OneToMany(() => ReviewReply, (reply) => reply.review)
  replies: ReviewReply[];

  @Column({ type: 'json', nullable: true })
  metadata: {
    deviceInfo?: string;
    location?: string;
    purchaseDate?: Date;
    tags?: string[];
  };
}
