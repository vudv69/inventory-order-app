import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './product.schema';
@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  findAll(skip = 0, take = 10, filter?: string): Promise<[Product[], number]> {
    const query = this.repo.createQueryBuilder('p');
    if (filter) query.where('p.name ILIKE :f', { f: `%${filter}%` });
    return query
      .orderBy('p.createdAt', 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  filter(start: number, end: number): Promise<[Product[], number]> {
    const take = end - start;
    const skip = start;
    const qb = this.repo
      .createQueryBuilder('p')
      .orderBy('p.created_at', 'DESC')
      .skip(skip)
      .take(take);

    return qb.getManyAndCount();
  }

  findById(id: string): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }

  findBySKU(sku: string): Promise<Product | null> {
    return this.repo.findOne({ where: { sku } });
  }

  save(product: Partial<Product>): Promise<Product> {
    return this.repo.save(product);
  }

  async deleteBySKU(sku: string): Promise<boolean> {
    const result = await this.repo.delete({ sku });
    return result.affected !== 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
