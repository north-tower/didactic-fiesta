import { IsString, IsNumber, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  sellerId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsOptional()
  @IsArray() // Validate that the field is an array
  @IsString({ each: true }) // Each element in the array must be a string
  images?: string[]; // Array of image filenames or paths

  @IsOptional()
  @IsString()
  status?: 'in_stock' | 'low_stock' | 'out_of_stock';
}
