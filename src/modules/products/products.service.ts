import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MediaService } from 'src/modules/media/media.service';
import { MediaPurpose } from 'src/common/enums/app.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createProductDto: CreateProductDto, files: Express.Multer.File[]): Promise<Product> {
    const { images, ...productData } = createProductDto;
    const product = this.productRepository.create(productData);
    const savedProduct = await this.productRepository.save(product);
  
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']; // Add allowed file extensions
    const fileArray = files.length === 1 ? [files[0]] : files;
  
    // Check if the files have a valid extension
    const invalidFiles = fileArray.filter(file => {
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
      return fileExtension && !allowedExtensions.includes(`.${fileExtension}`);
    });
  
    if (invalidFiles.length > 0) {
      throw new Error('One or more files have invalid extensions.');
    }
  
    const mediaEntities = await Promise.all(
      fileArray.map((file) =>
        this.mediaService.saveMedia(
          file,
          savedProduct.id,
          'product',
          MediaPurpose.PRODUCT_MAIN,
        ),
      ),
    );
    savedProduct.images = mediaEntities;
  
    return await this.productRepository.save(savedProduct);
  }

  async findAll(): Promise<any[]> {
    const products = await this.productRepository.find({
      relations: ['category'], // Ensure the category is fetched
    });

    const productIds = products.map((product) => product.id);
    const images = await this.mediaService.findByEntityIds(productIds, 'product');

    return products.map((product) => {
      const productImages = images.filter((image) => image.entityId === product.id);
      return {
        ...product,
        images: productImages.map((image) => image.filename),
      };
    });
  }

  async findOne(id: string): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'], // Ensure the category is fetched
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const images = await this.mediaService.findByEntityId(id, 'product');

    return {
      ...product,
      images: images.map((image) => image.filename),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, files: Express.Multer.File[]): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Update product fields
    Object.assign(product, updateProductDto);

    // If new files are provided, update images
    if (files && files.length > 0) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']; // Add allowed file extensions
      const fileArray = files.length === 1 ? [files[0]] : files;

      const invalidFiles = fileArray.filter((file) => {
        const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
        return fileExtension && !allowedExtensions.includes(`.${fileExtension}`);
      });

      if (invalidFiles.length > 0) {
        throw new Error('One or more files have invalid extensions.');
      }

      // Delete old images if necessary
      await this.mediaService.deleteByEntityId(id);

      const mediaEntities = await Promise.all(
        fileArray.map((file) =>
          this.mediaService.saveMedia(file, id, 'product', MediaPurpose.PRODUCT_MAIN),
        ),
      );

      product.images = mediaEntities;
    }

    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    return this.productRepository.delete(id);
  }
}
