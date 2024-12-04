import { BrandController } from '../controllers/brands.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/constants/jwt.constant';
import { Brand } from 'src/entities/brands.entity';
import { Users } from 'src/entities/users.entity';
import { BrandService } from 'src/services/brands.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, Users]),
    JwtModule.register({ secret: jwtConstants.secret, global: true }),
  ],
  providers: [BrandService],
  controllers: [BrandController],
})
export class BrandModule {}
