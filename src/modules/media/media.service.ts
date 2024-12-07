import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Media } from './entities/media.entity';
import { MediaType, MediaPurpose } from 'src/common/enums/app.enum';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async saveMedia(
    file: Express.Multer.File,
    entityId: string,
    entityType: string,
    purpose: MediaPurpose = MediaPurpose.PRODUCT_MAIN,
    metadata: { width?: number; height?: number; alt?: string } = {},
  ): Promise<Media> {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']; // Add allowed file extensions
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
  
    if (fileExtension && !allowedExtensions.includes(`.${fileExtension}`)) {
      throw new Error('File has an invalid extension.');
    }
  
    const media = this.mediaRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      type: MediaType.IMAGE,
      purpose,
      entityId,
      entityType,
      metadata,
    });
  
    return await this.mediaRepository.save(media);
  }
  
  

  async findByEntityId(entityId: string, entityType: string): Promise<Media[]> {
    return this.mediaRepository.find({
      where: { entityId, entityType },
    });
  }

  async findByEntityIds(entityIds: string[], entityType: string): Promise<Media[]> {
    return this.mediaRepository.find({
      where: { entityId: In(entityIds), entityType },
    });
  }

  
  async getMediaById(id: string): Promise<Media> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException('Media not found.');
    }
    return media;
  }

  async deleteByEntityId(id: string): Promise<{ message: string }> {
    const result = await this.mediaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Media not found.');
    }
    return { message: 'Media deleted successfully.' };
  }
}
