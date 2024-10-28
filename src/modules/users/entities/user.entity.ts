// src/modules/users/entities/user.entity.ts
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base.entity';
import { UserRole } from 'src/common/enums/app.enum';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Media } from 'src/modules/media/entities/media.entity';
import { NotificationEntity } from 'src/modules/notifications/entities/notification.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { PaymentMethod } from 'src/modules/payments/entities/payment-method.entity';
import { SalaryDeduction } from 'src/modules/payroll/entities/salary-deduction.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  emailVerificationExpires: Date;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @Column({ nullable: true })
  employeeId: string;

  @Column({ type: 'json', nullable: true })
  sellerProfile: {
    isVerified: boolean;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: Date;
    verifiedAt?: Date;
    rejectionReason?: string;
  };

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => SalaryDeduction, (deduction) => deduction.user)
  salaryDeductions: SalaryDeduction[];

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user)
  paymentMethods: PaymentMethod[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToOne(() => Media)
  @JoinColumn()
  avatar: Media;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
