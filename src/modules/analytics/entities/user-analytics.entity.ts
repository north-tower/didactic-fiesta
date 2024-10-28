// src/modules/analytics/entities/user-analytics.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('user_analytics')
export class UserAnalytics extends BaseEntity {
  @Column({ type: 'date' })
  date: Date;

  @Column()
  newUsersCount: number;

  @Column()
  activeUsersCount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  retentionRate: number;

  @Column({ type: 'json' })
  companyDistribution: {
    [companyId: string]: number;
  };

  @Column({ type: 'json' })
  roleDistribution: {
    [role: string]: number;
  };

  @Column({ type: 'json' })
  activityMetrics: {
    ordersPlaced: number;
    totalSpent: number;
    averageOrderValue: number;
    paymentMethodUsage: Record<string, number>;
  };

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
