// src/modules/media/entities/media-variant.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { ImageSize } from 'src/common/enums/app.enum';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Media } from './media.entity';

@Entity('media_variants')
export class MediaVariant extends BaseEntity {
  @Column({ type: 'uuid' })
  mediaId: string;

  @ManyToOne(() => Media, (media) => media.variants)
  media: Media;

  @Column({
    type: 'enum',
    enum: ImageSize,
  })
  size: ImageSize;

  @Column()
  url: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ type: 'json' })
  dimensions: {
    width: number;
    height: number;
  };

  @Column({ type: 'json', nullable: true })
  metadata: {
    quality?: number;
    format?: string;
    compression?: string;
  };
}
