// src/modules/categories/entities/category.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('categories')
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
