// src/modules/payroll/entities/salary-deduction.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { DeductionFrequency, DeductionStatus } from 'src/common/enums/app.enum';
import { Order } from 'src/modules/orders/entities/order.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { DeductionSchedule } from './deduction-schedule.entity';

@Entity('salary_deductions')
export class SalaryDeduction extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.salaryDeductions)
  user: User;

  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order)
  order: Order;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column()
  installments: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  installmentAmount: number;

  @Column({
    type: 'enum',
    enum: DeductionStatus,
    default: DeductionStatus.PENDING,
  })
  status: DeductionStatus;

  @Column({
    type: 'enum',
    enum: DeductionFrequency,
    default: DeductionFrequency.MONTHLY,
  })
  frequency: DeductionFrequency;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ type: 'json', nullable: true })
  metadata: {
    approvedBy?: string;
    approvalDate?: Date;
    rejectionReason?: string;
    notes?: string;
  };

  @OneToMany(() => DeductionSchedule, (schedule) => schedule.salaryDeduction, {
    cascade: true,
  })
  schedules: DeductionSchedule[];
}
