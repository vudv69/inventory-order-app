import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ProductUpdateDto,
  ProductCreateDto,
  toProductResponseDto,
  ProductResponse,
  PaginatedProductResponseDto,
} from './product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private repo: ProductRepository) {}

  async getProduct(id: string) {
    return this.repo.findById(id);
  }

  async getProducts(start = 0, end = 12): Promise<any> {
    const [data, total] = await this.repo.filter(start, end);
    const products = data.map((p) => toProductResponseDto(p));

    return products;
  }

  async createProduct(input: ProductCreateDto) {
    const sku = await this.generateSku();
    const product = await this.repo.save({
      ...input,
      sku,
    });
    return toProductResponseDto(product as any);
  }

  async updateProduct(id: string, input: ProductUpdateDto) {
    const dbProduct = await this.repo.findById(id);

    if (!dbProduct) {
      throw new NotFoundException('Product not found');
    }

    Object.assign(dbProduct, input);

    const updatedProduct = await this.repo.save(dbProduct);

    return toProductResponseDto(updatedProduct as any);
  }

  async deleteProduct(id: string) {
    const dbProduct = await this.repo.findById(id);

    if (!dbProduct) {
      throw new NotFoundException('Product not found');
    }

    await this.repo.delete(id);

    return true;
  }

  private async generateSku() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let sku = '';
    for (let i = 0; i < length; i++) {
      sku += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const product = await this.repo.findBySKU(sku);

    if (!product) {
      return sku;
    }

    return this.generateSku();
  }
}
