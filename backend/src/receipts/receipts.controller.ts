import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('receipts')
@UseGuards(JwtGuard)
export class ReceiptsController {
  constructor(private receiptsService: ReceiptsService) {}

  @Get(':id')
  async getReceipt(@Param('id') id: string) {
    return this.receiptsService.getReceipt(id);
  }

  @Get('order/:orderId')
  async getOrderReceipt(@Param('orderId') orderId: string) {
    return this.receiptsService.getOrderReceipt(orderId);
  }

  @Get()
  async getUserReceipts(@Req() req: any) {
    return this.receiptsService.getUserReceipts(req.user.id);
  }
}
