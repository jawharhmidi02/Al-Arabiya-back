import { Module } from '@nestjs/common';
import { AdminService } from '../services/admins.service';
import { AdminController } from '../controllers/admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import { Brand } from 'src/entities/brands.entity';
import { Category } from 'src/entities/categories.entity';
import { Order } from 'src/entities/orders.entity';
import { Product } from 'src/entities/products.entity';
import { SpecialOffer } from 'src/entities/specialOffers.entity';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { Customization } from 'src/entities/customizations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Brand,
      Category,
      Order,
      OrderProduct,
      Product,
      SpecialOffer,
      Customization,
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
