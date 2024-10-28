// src/modules/settings/entities/company-config.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('company_configs')
export class CompanyConfig extends BaseEntity {
  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  company: Company;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  maxDeductionPercentage: number;

  @Column()
  maxInstallments: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlySpendLimit: number;

  @Column({ type: 'simple-array', nullable: true })
  allowedCategories: string[];

  @Column({ default: true })
  isActive: boolean;
}
