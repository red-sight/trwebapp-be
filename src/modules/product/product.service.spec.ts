import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';

describe('ProductService', () => {
  let service: ProductService;
  const productRepositoryMock = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list', () => {
    it('list', async () => {
      const find = jest.spyOn(productRepositoryMock, 'find');
      productRepositoryMock.find.mockImplementation(() => Promise.resolve());
      await service.list();
      expect(find).toHaveBeenCalledTimes(1);
    });
  });
});
