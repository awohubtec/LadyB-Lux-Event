import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('products')
  async searchProducts(
    @Query('q') query?: string,
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('category') category?: string,
    @Query('vendorId') vendorId?: string,
  ) {
    return this.searchService.searchProducts(
      query,
      type,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
      category,
      vendorId,
    );
  }

  @Get('vendors')
  async searchVendors(
    @Query('q') query?: string,
    @Query('category') category?: string,
    @Query('verified') verified?: string,
  ) {
    return this.searchService.searchVendors(query, category, verified === 'true');
  }

  @Get('events')
  async searchEvents(
    @Query('q') query?: string,
    @Query('userId') userId?: string,
  ) {
    return this.searchService.searchEvents(query, userId);
  }
}
