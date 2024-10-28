// src/modules/payments/entities/payment-transaction.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { TransactionStatus, PaymentProvider } from 'src/common/enums/app.enum';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { PaymentMethod } from './payment-method.entity';

@Entity('payment_transactions')
export class PaymentTransaction extends BaseEntity {
  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order)
  order: Order;

  @Column({ type: 'uuid', nullable: true })
  paymentMethodId: string;

  @ManyToOne(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', nullable: true })
  currency: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
  })
  provider: PaymentProvider;

  @Column({ type: 'varchar', nullable: true })
  providerTransactionId: string;

  @Column({ type: 'json', nullable: true })
  providerResponse: {
    raw?: any;
    code?: string;
    message?: string;
  };

  @Column({ type: 'json', nullable: true })
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    deviceId?: string;
  };

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  refundReference: string;

  // For M-Pesa specific details
  @Column({ type: 'json', nullable: true })
  mpesaDetails: {
    phoneNumber?: string;
    accountReference?: string;
    transactionDesc?: string;
    merchantRequestId?: string;
    checkoutRequestId?: string;
    responseCode?: string;
    responseDescription?: string;
    customerMessage?: string;
  };
}
