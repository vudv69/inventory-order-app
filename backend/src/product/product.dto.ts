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

export class ProductResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

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

export function toProductResponseDto(p: Product): ProductResponse {
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    price: Number(p.price) as any,
    status: p.status,
    inventoryCount: p.inventoryCount ?? null,
  } as ProductResponse;
}

export class PaginatedProductResponseDto {
  @ApiProperty({ type: [ProductResponse] })
  data: ProductResponse[];

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
