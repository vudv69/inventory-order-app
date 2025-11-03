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
    inventory_count: 100,
    status: ProductStatus.Active,
  };

  const mockService = {
    list: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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

  describe('getAll', () => {
    it('should return paginated products', async () => {
      const paginatedResult = { data: [mockProduct], total: 1 };
      mockService.list.mockResolvedValue(paginatedResult);

      const result = await controller.getAll(1, 10);
      expect(result).toEqual(paginatedResult);
      expect(mockService.list).toHaveBeenCalledWith(1, 10, undefined);
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      mockService.create.mockResolvedValue(mockProduct);

      const result = await controller.create({
        name: mockProduct.name,
        sku: mockProduct.sku,
        price: mockProduct.price,
        inventory_count: mockProduct.inventory_count,
        status: mockProduct.status,
      });
      expect(result).toEqual(mockProduct);

      expect(mockService.create).toHaveBeenCalledWith({
        name: mockProduct.name,
        sku: mockProduct.sku,
        price: mockProduct.price,
        inventory_count: mockProduct.inventory_count,
        status: mockProduct.status,
      });
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      mockService.update.mockResolvedValue(mockProduct);

      const result = await controller.update(mockProduct.id, {
        name: mockProduct.name,
      });
      expect(result).toEqual(mockProduct);

      expect(mockService.update).toHaveBeenCalledWith(mockProduct.id, {
        name: mockProduct.name,
      });
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockService.remove.mockResolvedValue({ deleted: true });

      const result = await controller.remove(mockProduct.id);
      expect(result).toEqual({ deleted: true });

      expect(mockService.remove).toHaveBeenCalledWith(mockProduct.id);
    });
  });
});
