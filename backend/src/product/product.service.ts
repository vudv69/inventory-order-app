import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedProductResponseDto } from './product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly repo: ProductRepository) {}

  async getProducts(
    page = 1,
    limit = 10,
    filter?: string,
    status?: string,
  ): Promise<PaginatedProductResponseDto> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.repo.filter(skip, limit, filter, status);
    return { data, total, page, limit };
  }

  async createProduct(input) {
    return this.repo.save(input);
  }

  async updateProduct(id: number, input) {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    Object.assign(product, input);
    return this.repo.save(product);
  }

  async deleteProduct(id: number) {
    await this.repo.delete(id);
    return true;
  }
}
