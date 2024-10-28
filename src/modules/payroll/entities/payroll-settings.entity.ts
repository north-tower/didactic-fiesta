// src/modules/payroll/entities/payroll-settings.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { DeductionFrequency } from 'src/common/enums/app.enum';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('payroll_settings')
export class PayrollSettings extends BaseEntity {
  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.payrollSettings)
  company: Company;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  maxDeductionPercentage: number;

  @Column()
  maxInstallments: number;

  @Column({
    type: 'enum',
    enum: DeductionFrequency,
    default: DeductionFrequency.MONTHLY,
  })
  deductionFrequency: DeductionFrequency;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minimumSalary: number;

  @Column({ type: 'json', nullable: true })
  deductionRules: {
    gracePeriod?: number;
    allowMultipleDeductions?: boolean;
    maxTotalDeductionAmount?: number;
    blackoutDates?: string[];
  };

  @Column({ default: true })
  isActive: boolean;
}
