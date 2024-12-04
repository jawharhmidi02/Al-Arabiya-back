import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Users } from 'src/entities/users.entity';
import { Category } from './entities/categories.entity';
import { Brand } from './entities/brands.entity';
import { Product } from './entities/products.entity';
import { Order } from './entities/orders.entity';
import { OrderProduct } from './entities/orderProduct.entity';

dotenv.config();

const {
  SUPABASE_HOST,
  SUPABASE_PORT,
  SUPABASE_USERNAME,
  SUPABASE_PASSWORD,
  SUPABASE_DATABASE,
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
      entities: [Users, Category, Brand, Product, Order, OrderProduct],
      synchronize: true,
    }),
  ],
})
export class ConnectModule {}
