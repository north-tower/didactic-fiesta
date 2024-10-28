// src/modules/orders/entities/order.entity.ts
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { PaymentTransaction } from 'src/modules/payments/entities/payment-transaction.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from 'src/common/enums/app.enum';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({ type: 'uuid' })
  addressId: string;

  @ManyToOne(() => Address)
  address: Address;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ nullable: true })
  installments: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItem[];

  @OneToMany(() => PaymentTransaction, (transaction) => transaction.order)
  transactions: PaymentTransaction[];
}
