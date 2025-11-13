import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from './order.schema';

export class OrderItemDto {
  @ApiProperty({ example: 'uuid-product-123' })
  productId: string;

  @ApiProperty({ example: 'Product Name' })
  productName?: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 99.9 })
  price: number;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Ryan Pham' })
  customerName: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.Pending })
  status: OrderStatus;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];

  @ApiProperty({ example: 'manager@example.com' })
  createdBy?: string;

  @ApiProperty({ example: '2025-11-12T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-11-12T10:10:00.000Z' })
  updatedAt: Date;
}

export class OrderCreateDto {
  @ApiProperty({ example: 'Ryta' })
  customerName: string;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];

  @ApiProperty({ example: 'user@example.com' })
  createdBy?: string;
}

export class OrderUpdateDto {
  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;
}
