import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { VendorsModule } from './vendors/vendors.module';
import { AdminModule } from './admin/admin.module';
import { InventoryModule } from './inventory/inventory.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailModule } from './email/email.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    AuthModule,
    EventsModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    UsersModule,
    VendorsModule,
    AdminModule,
    InventoryModule,
    ReceiptsModule,
    NotificationsModule,
    EmailModule,
    ReviewsModule,
    AnalyticsModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
