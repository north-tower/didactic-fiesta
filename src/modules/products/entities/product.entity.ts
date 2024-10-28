// src/modules/products/entities/product.entity.ts
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Media } from 'src/modules/media/entities/media.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Seller } from 'src/modules/sellers/entities/seller.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => Seller, (seller) => seller.products)
  seller: Seller;

  @Column({ type: 'uuid' })
  sellerId: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @OneToMany(() => Media, (media) => media.entityId)
  images: Media[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  reviewCount: number;
}
