// src/modules/cart/entities/cart-item.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/modules/products/entities/product.entity';

@Entity('cart_items')
export class CartItem extends BaseEntity {
  @Column({ type: 'uuid' })
  cartId: string;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Indicates if item is available and within company policy limits',
  })
  isValid: boolean;

  @Column({ type: 'json', nullable: true })
  validationMessages: string[];

  @Column({ type: 'json', nullable: true })
  metadata: {
    selectedOptions?: Record<string, any>;
    notes?: string;
    companyPolicyChecks?: {
      withinBudget?: boolean;
      allowedCategory?: boolean;
      quantityLimit?: boolean;
    };
  };
}
