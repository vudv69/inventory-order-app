import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedProductResponseDto } from './product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly repo: ProductRepository) {}

  async list(
    page = 1,
    limit = 10,
    filter?: string,
  ): Promise<PaginatedProductResponseDto> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.repo.findAll(skip, limit, filter);
    return { data, total, page, limit };
  }

  async create(input) {
    return this.repo.save(input);
  }

  async update(id: number, input) {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    Object.assign(product, input);
    return this.repo.save(product);
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }
}
