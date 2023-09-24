import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ERole } from './enums/role.enum';

describe('AdminService', () => {
  let service: AdminService;
  const adminRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Admin),
          useValue: adminRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('create root admin user', async () => {
      const create = jest
        .spyOn(adminRepositoryMock, 'create')
        .mockImplementation(() => 'created');
      const save = jest
        .spyOn(adminRepositoryMock, 'save')
        .mockImplementation(() => Promise.resolve('saved'));
      const email = 'test@email.com';
      const password = 'password';
      const role = ERole.ROOT;
      const res = await service.create(email, password, role);
      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(
        expect.objectContaining({
          email,
          password: expect.not.stringMatching(password),
          role,
          salt: expect.any(String),
        }),
      );
      expect(save).toBeCalledTimes(1);
      expect(save).toBeCalledWith('created');
      expect(res).toEqual('saved');
    });
  });
});
