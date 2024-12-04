import { CategoryController } from '../controllers/categories.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/constants/jwt.constant';
import { Category } from 'src/entities/categories.entity';
import { Users } from 'src/entities/users.entity';
import { CategoryService } from 'src/services/categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Users]),
    JwtModule.register({ secret: jwtConstants.secret, global: true }),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
