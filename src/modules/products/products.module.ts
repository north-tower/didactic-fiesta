import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Media } from '../media/entities/media.entity';
import { MediaService } from '../media/media.service';

@Module({
  imports: [  MulterModule.register({
    dest: './uploads', // Specify where to save files
  }),
    TypeOrmModule.forFeature([Product,  Media])],
  controllers: [ProductsController],
  providers: [ProductsService, MediaService],
  exports: [ProductsService, ],
})
export class ProductsModule {}
