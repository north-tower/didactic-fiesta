// src/modules/media/entities/media-folder.entity.ts
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Media } from './media.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('media_folders')
export class MediaFolder extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @ManyToOne(() => MediaFolder, (folder) => folder.subFolders)
  parent: MediaFolder;

  @OneToMany(() => MediaFolder, (folder) => folder.parent)
  subFolders: MediaFolder[];

  @OneToMany(() => Media, (media) => media.folder)
  media: Media[];

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'json', nullable: true })
  metadata: {
    path?: string;
    access?: string[];
    settings?: Record<string, any>;
  };
}
