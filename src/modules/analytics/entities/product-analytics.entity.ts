// src/modules/analytics/entities/product-analytics.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
@Entity('product_analytics')
export class ProductAnalytics extends BaseEntity {
  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  viewCount: number;

  @Column()
  addToCartCount: number;

  @Column()
  purchaseCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  revenue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  conversionRate: number;

  @Column({ type: 'json', nullable: true })
  demographics: {
    ageGroups?: Record<string, number>;
    locations?: Record<string, number>;
    companies?: Record<string, number>;
  };

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
