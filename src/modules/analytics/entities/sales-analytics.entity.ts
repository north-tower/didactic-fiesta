// src/modules/analytics/entities/sales-analytics.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('sales_analytics')
export class SalesAnalytics extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @ManyToOne(() => Company)
  company: Company;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalSales: number;

  @Column()
  ordersCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  averageOrderValue: number;

  @Column()
  customersCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  salaryDeductionsTotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cashPaymentsTotal: number;

  @Column({ type: 'json' })
  paymentMethodBreakdown: {
    [key: string]: {
      count: number;
      amount: number;
    };
  };

  @Column({ type: 'json' })
  categoryBreakdown: {
    [categoryId: string]: {
      sales: number;
      count: number;
    };
  };

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
