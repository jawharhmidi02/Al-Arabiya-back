import { Module } from '@nestjs/common';
import { ConnectModule } from 'src/connect.module';
import { UserModule } from './modules/users.module';
import { CategoryModule } from './modules/categories.module';
import { BrandModule } from './modules/brands.module';
import { ProductModule } from './modules/products.module';
import { PingModule } from './modules/ping_database.module';
import { OrderModule } from './modules/orders.module';

@Module({
  imports: [
    ConnectModule,
    UserModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    PingModule,
    OrderModule,
  ],
})
export class AppModule {}
