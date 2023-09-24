import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { IsEmail } from 'class-validator';
import { ERole } from './enums/role.enum';

describe('AdminController', () => {
  let controller: AdminController;
  const adminServiceMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: adminServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('init superuser', () => {
    it('init superuser: success', async () => {
      const create = jest
        .spyOn(adminServiceMock, 'create')
        .mockImplementation(() => Promise.resolve('created'));
      const email = 'admin.email.com';
      const password = 'P@ssw0rd';
      const res = await controller.initSu({
        email,
        password,
      });
      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(email, password, ERole.ROOT);
      expect(res).toEqual('created');
    });
  });
});
