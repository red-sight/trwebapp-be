import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERole } from './enums/role.enum';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  public create(email: string, password: string, role: ERole): Promise<Admin> {
    const salt = randomBytes(64).toString('hex');
    const hash = pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString(
      'hex',
    );
    const admin = this.adminRepository.create({
      email,
      password: hash,
      salt,
      role,
    });
    return this.adminRepository.save(admin);
  }
}
