import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.schema';

@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  findAll(skip = 0, take = 10, filter?: string) {
    const query = this.repo.createQueryBuilder('p');
    if (filter) query.where('p.name ILIKE :f', { f: `%${filter}%` });
    return query.orderBy('p.id', 'ASC').skip(skip).take(take).getManyAndCount();
  }

  filter(
    skip: number,
    limit: number,
    filter?: string,
    status?: string,
  ): Promise<[Product[], number]> {
    const qb = this.repo.createQueryBuilder('p').skip(skip).take(limit);

    if (filter) {
      qb.andWhere('(p.name ILIKE :filter OR p.sku ILIKE :filter)', {
        filter: `%${filter}%`,
      });
    }

    if (status) {
      qb.andWhere('p.status = :status', { status });
    }
    return qb.getManyAndCount();
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  save(product: Partial<Product>) {
    return this.repo.save(product);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
