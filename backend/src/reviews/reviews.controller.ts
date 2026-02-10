import { Controller, Post, Get, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createReview(@Req() req: any, @Body() body: any) {
    return this.reviewsService.createReview(req.user.id, body.vendorId, body);
  }

  @Get('vendor/:vendorId')
  async getVendorReviews(@Param('vendorId') vendorId: string) {
    return this.reviewsService.getVendorReviews(vendorId);
  }

  @Get('vendor/:vendorId/rating')
  async getVendorRating(@Param('vendorId') vendorId: string) {
    return this.reviewsService.getVendorRating(vendorId);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}
