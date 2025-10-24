import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.schema';
import { OrderItem } from './order_item.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  providers: [],
  exports: [],
})
export class OrderModule {}
