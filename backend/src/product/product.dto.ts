import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProductStatus, Product } from './product.schema';
import { sampleProducts } from './products.sample';

export class ProductResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'Product name' })
  name: string;

  @ApiProperty({ example: 'Product description' })
  description: string;

  @ApiProperty({ example: 'Product SKU' })
  sku: string;

  @ApiProperty({ example: 999.9 })
  price: number;
}

export function toProductResponseDto(p: Product): ProductResponse {
  const randomItem =
    sampleProducts[Math.floor(Math.random() * sampleProducts.length)];

  return {
    id: p.id,
    name: p.name,
    description: p.description,
    sku: p.sku,
    price: Number(p.price) as any,
    createdAt: p.createdAt,
    isActive: p.isActive,
    images: randomItem.images,
    category: randomItem.category,
  } as ProductResponse;
}

export class PaginatedProductResponseDto {
  @ApiProperty({ type: [ProductResponse] })
  data: ProductResponse[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  start: number;

  @ApiProperty({ example: 12 })
  end: number;
}

export class ProductCreateDto {
  @ApiProperty({ example: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Product description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '999.9' })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ example: true })
  @IsOptional()
  isActive?: boolean = true;
}

export class ProductUpdateDto extends PartialType(ProductCreateDto) {}
