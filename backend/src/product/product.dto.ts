import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProductStatus } from './product.schema';

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Product name' })
  name: string;

  @ApiProperty({ example: 'Product SKU' })
  sku: string;

  @ApiProperty({ example: 999.9 })
  price: number;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.Active })
  status: ProductStatus;

  @ApiProperty({ example: 50, nullable: true })
  inventoryCount: number | null;
}

export class PaginatedProductResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data: ProductResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}

export class ProductCreateDto {
  @ApiProperty({ example: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Product SKU' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 999.9 })
  @IsNumber()
  @Min(0, { message: 'Price must be positive number' })
  @IsNotEmpty()
  price?: number = 0;

  @ApiProperty({
    enum: ProductStatus,
    example: ProductStatus.Active,
  })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ example: 5, required: false, default: 0 })
  @IsNumber()
  @Min(0, { message: 'Inventory count must be zero or positive' })
  @IsOptional()
  inventoryCount?: number = 0;
}

export class ProductUpdateDto extends PartialType(ProductCreateDto) {}
