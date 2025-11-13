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
} from './product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private repo: ProductRepository) {}

  async getProducts(start = 0, end = 12): Promise<ProductResponse[]> {
    const [data, total] = await this.repo.filter(start, end);
    return data.map((p) => toProductResponseDto(p));
  }

  async createProduct(input: ProductCreateDto) {
    const product = await this.repo.findBySKU(input.sku);
    if (product) throw new ConflictException('Product SKU exists');
    const saved = await this.repo.save(input as any);
    return toProductResponseDto(saved as any);
  }

  async updateProduct(id: string, input: ProductUpdateDto) {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (input.sku == product.sku) {
      const existing = await this.repo.findBySKU(input.sku);
      if (existing) throw new ConflictException('Product SKU already exists');
    }
    Object.assign(product, input);
    const saved = await this.repo.save(product);
    return toProductResponseDto(saved as any);
  }

  async deleteProduct(id: string) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundException('Product not found');
    return true;
  }
}
