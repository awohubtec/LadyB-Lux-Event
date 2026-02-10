import { Module } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ReceiptsService],
  controllers: [ReceiptsController],
  exports: [ReceiptsService],
})
export class ReceiptsModule {}
