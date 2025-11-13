import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.schema';
import { OrderItem } from './order_item.schema';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { ProductModule } from 'src/product/product.module';
import { OrderController } from './order.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), ProductModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
