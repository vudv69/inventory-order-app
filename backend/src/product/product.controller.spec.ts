import { Test } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductStatus } from './product.schema';

describe('ProductController', () => {
  let controller: ProductController;

  const mockProduct = {
    id: 1,
    name: 'Milk',
    sku: 'MILK123',
    price: 10,
    inventoryCount: 100,
    status: ProductStatus.Active,
  };

  const mockService = {
    getProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockService }],
    }).compile();

    controller = module.get(ProductController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const paginatedResult = { data: [mockProduct], total: 1 };
      mockService.getProducts.mockResolvedValue(paginatedResult);

      const result = await controller.getProducts(1, 10);
      expect(result).toEqual(paginatedResult);
      expect(mockService.getProducts).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
      );
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      mockService.createProduct.mockResolvedValue(mockProduct);

      const result = await controller.createProduct({
        name: mockProduct.name,
        sku: mockProduct.sku,
        price: mockProduct.price,
        inventoryCount: mockProduct.inventoryCount,
        status: mockProduct.status,
      });
      expect(result).toEqual(mockProduct);

      expect(mockService.createProduct).toHaveBeenCalledWith({
        name: mockProduct.name,
        sku: mockProduct.sku,
        price: mockProduct.price,
        inventoryCount: mockProduct.inventoryCount,
        status: mockProduct.status,
      });
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      mockService.updateProduct.mockResolvedValue(mockProduct);

      const result = await controller.updateProduct(mockProduct.id, {
        name: mockProduct.name,
      });
      expect(result).toEqual(mockProduct);

      expect(mockService.updateProduct).toHaveBeenCalledWith(mockProduct.id, {
        name: mockProduct.name,
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockService.deleteProduct.mockResolvedValue({ deleted: true });

      const result = await controller.deleteProduct(mockProduct.id);
      expect(result).toEqual({ deleted: true });

      expect(mockService.deleteProduct).toHaveBeenCalledWith(mockProduct.id);
    });
  });
});
