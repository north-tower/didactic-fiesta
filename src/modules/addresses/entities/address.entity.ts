// src/modules/addresses/entities/address.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('addresses')
export class Address extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;

  @Column()
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column({ default: 'Kenya' })
  country: string;

  @Column({ default: false })
  isDefault: boolean;

  @Column({
    type: 'enum',
    enum: ['SHIPPING', 'BILLING', 'BOTH'],
    default: 'BOTH',
  })
  type: 'SHIPPING' | 'BILLING' | 'BOTH';
}
