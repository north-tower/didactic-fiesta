// src/modules/companies/entities/company.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { Media } from 'src/modules/media/entities/media.entity';
import { PayrollSettings } from 'src/modules/payroll/entities/payroll-settings.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity('companies')
export class Company extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  registrationNumber: string;

  @Column()
  contactPerson: string;

  @Column()
  contactEmail: string;

  @Column()
  contactPhone: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => PayrollSettings, (settings) => settings.company)
  payrollSettings: PayrollSettings[];

  @OneToOne(() => Media)
  @JoinColumn()
  logo: Media;

  @OneToOne(() => Media)
  @JoinColumn()
  banner: Media;

  @OneToMany(() => User, (user) => user.company)
  employees: User[];
}
