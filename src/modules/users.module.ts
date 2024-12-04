import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserController } from '../controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UserController],
  providers: [UsersService],
})
export class UserModule {}
