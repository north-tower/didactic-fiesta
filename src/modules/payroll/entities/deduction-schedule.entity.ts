// src/modules/payroll/entities/deduction-schedule.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { SalaryDeduction } from './salary-deduction.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { DeductionStatus } from 'src/common/enums/app.enum';

@Entity('deduction_schedules')
export class DeductionSchedule extends BaseEntity {
  @Column({ type: 'uuid' })
  salaryDeductionId: string;

  @ManyToOne(() => SalaryDeduction, (deduction) => deduction.schedules)
  salaryDeduction: SalaryDeduction;

  @Column()
  installmentNumber: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: DeductionStatus,
    default: DeductionStatus.PENDING,
  })
  status: DeductionStatus;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'json', nullable: true })
  paymentDetails: {
    transactionId?: string;
    payrollReference?: string;
    processedBy?: string;
    notes?: string;
  };
}
