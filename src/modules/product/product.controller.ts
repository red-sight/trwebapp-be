import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@guards/auth.guard';

@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async list() {
    return this.productService.list();
  }
}
