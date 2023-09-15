import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Account } from '@modules/account/account.entity';
import { FinanceModule } from '@modules/finance/finance.module';
import { AccountModule } from '@modules/account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Account]),
    FinanceModule,
    AccountModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
