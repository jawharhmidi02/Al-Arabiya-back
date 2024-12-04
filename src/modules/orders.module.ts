import { OrderController } from '../controllers/orders.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/constants/jwt.constant';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { Order } from 'src/entities/orders.entity';
import { Product } from 'src/entities/products.entity';
import { Users } from 'src/entities/users.entity';
import { OrderService } from 'src/services/orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct, Product, Users]),
    JwtModule.register({ secret: jwtConstants.secret, global: true }),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
