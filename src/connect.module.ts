import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Users } from 'src/entities/users.entity';
import { Category } from './entities/categories.entity';
import { Brand } from './entities/brands.entity';
import { Product } from './entities/products.entity';
import { Order } from './entities/orders.entity';
import { OrderProduct } from './entities/orderProduct.entity';
import { SpecialOffer } from './entities/specialOffers.entity';

dotenv.config();

const {
  SUPABASE_HOST,
  SUPABASE_PORT,
  SUPABASE_USERNAME,
  SUPABASE_PASSWORD,
  SUPABASE_DATABASE,
  SUPABASE_DATABASE_URL,
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: SUPABASE_HOST,
      port: parseInt(SUPABASE_PORT, 10),
      username: SUPABASE_USERNAME,
      password: SUPABASE_PASSWORD,
      database: SUPABASE_DATABASE,
      url: SUPABASE_DATABASE_URL,
      entities: [
        Users,
        Category,
        Brand,
        Product,
        Order,
        OrderProduct,
        SpecialOffer,
      ],
      synchronize: Boolean(process.env.DEVELOPMENT) || false,
    }),
  ],
})
export class ConnectModule {}
