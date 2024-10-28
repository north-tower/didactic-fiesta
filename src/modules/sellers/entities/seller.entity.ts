// src/modules/sellers/entities/seller.entity.ts
import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Media } from 'src/modules/media/entities/media.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/modules/products/entities/product.entity';

@Entity('sellers')
export class Seller extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'tax_id', unique: true })
  taxId: string;

  @Column({ type: 'json', nullable: true })
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @OneToOne(() => Media)
  @JoinColumn()
  logo: Media;

  @OneToOne(() => Media)
  @JoinColumn()
  banner: Media;

  @OneToMany(() => Review, (review) => review.seller)
  reviews: Review[];

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  reviewCount: number;
}
