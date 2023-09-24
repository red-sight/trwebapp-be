import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Session,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { InitSuDto } from './dtos/init_su.dto';
import { ERole } from './enums/role.enum';
import { Admin } from './admin.entity';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { Roles } from '@decorators/admin.role.decorator';
import { AdminRoleGuard } from '@guards/admin.role.guard';

@Controller('admin')
@UseFilters(new I18nValidationExceptionFilter())
@UseGuards(AdminRoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/init_su')
  @UseInterceptors(ClassSerializerInterceptor)
  async initSu(
    @Body() initSuDto: InitSuDto,
    @Session() session: any,
  ): Promise<Admin> {
    const admin = await this.adminService.create(
      initSuDto.email,
      initSuDto.password,
      ERole.ROOT,
    );
    session.adminId = admin.id;
    session.adminRole = admin.role;
    return admin;
  }

  @Get('/me')
  @Roles('root')
  me(@Session() session: any) {
    return {
      id: session.adminId,
      role: session.adminRole,
    };
  }
}
