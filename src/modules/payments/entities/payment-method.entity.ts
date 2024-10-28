// src/modules/payments/entities/payment-method.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { PaymentMethodType, PaymentProvider } from 'src/common/enums/app.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('payment_methods')
export class PaymentMethod extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.paymentMethods)
  user: User;

  @Column({
    type: 'enum',
    enum: PaymentMethodType,
  })
  type: PaymentMethodType;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
  })
  provider: PaymentProvider;

  @Column({ type: 'json' })
  details: {
    last4?: string;
    expiryMonth?: string;
    expiryYear?: string;
    brand?: string;
    phone?: string;
    email?: string;
    token?: string;
  };

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;
}
