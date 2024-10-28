// src/modules/orders/entities/order-item.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'json', nullable: true })
  productSnapshot: {
    name: string;
    description: string;
    sellerId: string;
    categoryId: string;
  };
}
