import { ProductController } from '../controllers/products.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/constants/jwt.constant';
import { Product } from 'src/entities/products.entity';
import { Users } from 'src/entities/users.entity';
import { ProductService } from 'src/services/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Users]),
    JwtModule.register({ secret: jwtConstants.secret, global: true }),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
