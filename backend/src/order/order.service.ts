import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderRepository } from './order.repository';
import { ProductRepository } from '../product/product.repository';
import { OrderCreateDto, OrderUpdateDto } from './order.dto';
import { OrderStatus, Order } from './order.schema';
import { OrderItem } from './order_item.schema';
import { Product } from 'src/product/product.schema';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly productRepo: ProductRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(input: OrderCreateDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const item of input.items) {
        const product = await queryRunner.manager
          .createQueryBuilder(Product, 'p')
          .setLock('pessimistic_write')
          .where('p.id = :id', { id: item.productId })
          .getOne();

        if (!product)
          throw new NotFoundException(`Product ${item.productId} not found`);

        if (product.inventoryCount < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for product ${product.name}`,
          );
        }

        product.inventoryCount -= item.quantity;
        await queryRunner.manager.save(product);
      }

      const order = new Order();
      order.customerName = input.customerName;
      order.status = OrderStatus.Pending;
      order.items = [] as OrderItem[];

      for (const it of input.items) {
        const oi = new OrderItem();
        oi.quantity = it.quantity;
        oi.price = it.price as any;
        oi.product = (await queryRunner.manager.findOne(Product, {
          where: { id: it.productId },
        })) as Product;
        order.items.push(oi);
      }

      const saved = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(page = 1, limit = 10, filter?: string) {
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await this.orderRepo.findAll(skip, Number(limit), filter);
    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async findById(id: string) {
    return this.orderRepo.findById(id);
  }

  async updateOrder(id: string, input: OrderUpdateDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id },
        relations: ['items', 'items.product'],
      });
      if (!order) throw new NotFoundException('Order not found');

      if (input.status && input.status !== order.status) {
        if (input.status === OrderStatus.Cancelled) {
          if (order.status === OrderStatus.Fulfilled) {
            throw new BadRequestException('Cannot cancel a fulfilled order');
          }

          for (const item of order.items) {
            if (!item.product || !item.product.id) {
              const product = await queryRunner.manager.findOne(Product, {
                where: { id: (item as any).product?.id ?? (item as any).productId },
              });
              if (product) {
                product.inventoryCount += item.quantity;
                await queryRunner.manager.save(product);
              }
            } else {
              const product = await queryRunner.manager
                .createQueryBuilder(Product, 'p')
                .setLock('pessimistic_write')
                .where('p.id = :id', { id: item.product.id })
                .getOne();
              if (product) {
                product.inventoryCount += item.quantity;
                await queryRunner.manager.save(product);
              }
            }
          }
        }
      }

      Object.assign(order, input);
      const saved = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

