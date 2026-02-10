import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Get('vendor/:vendorId')
  async getProductsByVendor(@Param('vendorId') vendorId: string) {
    return this.productsService.getProductsByVendor(vendorId);
  }

  @Post(':id/check-availability')
  @UseGuards(JwtGuard)
  async checkAvailability(
    @Param('id') productId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('qty') qty: string,
  ) {
    const quantity = parseInt(qty, 10);
    const available = await this.productsService.checkAvailability(
      productId,
      startDate,
      endDate,
      quantity,
    );
    return { available };
  }

  @Post(':id/book-availability')
  @UseGuards(JwtGuard)
  async bookAvailability(
    @Param('id') productId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('qty') qty: string,
  ) {
    const quantity = parseInt(qty, 10);
    return this.productsService.bookAvailability(
      productId,
      startDate,
      endDate,
      quantity,
    );
  }
}
