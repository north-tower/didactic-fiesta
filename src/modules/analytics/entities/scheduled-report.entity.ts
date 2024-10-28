// src/modules/analytics/entities/scheduled-report.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { ReportType, ReportFrequency } from 'src/common/enums/app.enum';
import { Entity, Column } from 'typeorm';

@Entity('scheduled_reports')
export class ScheduledReport extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ReportType,
  })
  type: ReportType;

  @Column({
    type: 'enum',
    enum: ReportFrequency,
  })
  frequency: ReportFrequency;

  @Column({ type: 'json' })
  recipients: string[];

  @Column({ type: 'json' })
  configuration: {
    metrics: string[];
    filters?: Record<string, any>;
    groupBy?: string[];
    sortBy?: string;
    format?: string;
  };

  @Column({ type: 'timestamp' })
  nextRunAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastRunAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
