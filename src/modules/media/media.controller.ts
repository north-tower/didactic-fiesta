import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { MediaService } from './media.service';
  import { MediaPurpose } from 'src/common/enums/app.enum';
  
  @Controller('media')
  export class MediaController {
    constructor(private readonly mediaService: MediaService) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadMedia(
      @UploadedFile() file: Express.Multer.File,
    ) {
      if (!file) {
        throw new BadRequestException('File is required.');
      }
  
      // Hardcoded entityId and entityType for example purposes
      const entityId = 'some-entity-id'; // Replace with actual entity ID
      const entityType = 'product'; // Replace with actual entity type
  
      return await this.mediaService.saveMedia(file, entityId, entityType, MediaPurpose.PRODUCT_MAIN);
    }
  }
  