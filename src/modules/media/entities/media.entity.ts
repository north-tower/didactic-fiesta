// src/modules/media/entities/media.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { MediaPurpose, MediaType } from 'src/common/enums/app.enum';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { MediaVariant } from './media-variant.entity';
import { MediaFolder } from './media-folder.entity';
import { Product } from 'src/modules/products/entities/product.entity';

@Entity('media')
export class Media extends BaseEntity {
  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type: MediaType;

  @Column({
    type: 'enum',
    enum: MediaPurpose,
  })
  purpose: MediaPurpose;

  @Column({ type: 'uuid' })
  entityId: string;

  @Column()
  entityType: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'uuid', nullable: true })
  folderId: string;

  @ManyToOne(() => MediaFolder, (folder) => folder.media)
  folder: MediaFolder;

  @Column({ type: 'json', nullable: true })
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    encoding?: string;
    alt?: string;
    title?: string;
    description?: string;
    tags?: string[];
  };

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => MediaVariant, (variant) => variant.media, {
    cascade: true,
  })
  variants: MediaVariant[];

  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  product: Product;

}
