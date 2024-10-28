import { BaseEntity } from 'src/common/entities/base.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

// src/modules/discounts/entities/company-discount.entity.ts
@Entity('company_discounts')
export class CompanyDiscount extends BaseEntity {
  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  company: Company;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, { nullable: true })
  category: Category;

  @Column({ type: 'timestamp' })
  validFrom: Date;

  @Column({ type: 'timestamp' })
  validUntil: Date;

  @Column({ default: true })
  isActive: boolean;
}
