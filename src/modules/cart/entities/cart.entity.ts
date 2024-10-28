// src/modules/cart/entities/cart.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { CartStatus } from 'src/common/enums/app.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.carts)
  user: User;

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  companyDiscount: number;

  @Column({
    type: 'boolean',
    default: false,
    comment:
      'Indicates if cart items have been validated against company policy',
  })
  isValidated: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
  })
  items: CartItem[];

  @Column({ type: 'json', nullable: true })
  metadata: {
    preferredPaymentMethod?: 'CASH' | 'SALARY_DEDUCTION';
    requestedInstallments?: number;
    notes?: string;
    deviceInfo?: string;
  };
}
