import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.schema';

@Injectable()
export class OrderRepository {
  constructor(@InjectRepository(Order) private repo: Repository<Order>) {}

  findAll(skip = 0, take = 10, filter?: string): Promise<[Order[], number]> {
    const query = this.repo.createQueryBuilder('o');
    if (filter) query.where('o.customerName ILIKE :f', { f: `%${filter}%` });
    return query
      .orderBy('o.createdAt', 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  findById(id: string): Promise<Order | null> {
    return this.repo.findOne({ where: { id } });
  }

  save(order: Partial<Order>): Promise<Order> {
    return this.repo.save(order);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
