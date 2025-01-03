import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConnectModule } from 'src/connect.module';
import { UserModule } from './modules/users.module';
import { CategoryModule } from './modules/categories.module';
import { BrandModule } from './modules/brands.module';
import { ProductModule } from './modules/products.module';
import { PingModule } from './modules/ping_database.module';
import { OrderModule } from './modules/orders.module';
import { AdminModule } from './modules/admins.module';
import { SpecialOfferModule } from './modules/specialOffers.module';
import { CustomizationModule } from './modules/customizations.module';
import { CorsMiddleware } from './middleware/cors.middleware';

@Module({
  imports: [
    ConnectModule,
    UserModule,
    AdminModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    PingModule,
    OrderModule,
    SpecialOfferModule,
    CustomizationModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
