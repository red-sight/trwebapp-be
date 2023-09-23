import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  const productServiceMock = {
    list: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: productServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('list', async () => {
      const list = jest
        .spyOn(productServiceMock, 'list')
        .mockImplementation(() => Promise.resolve());
      await controller.list();
      expect(list).toHaveBeenCalledTimes(1);
    });
  });
});
