import { CustomizationController } from '../controllers/customizations.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/constants/jwt.constant';
import { Customization } from 'src/entities/customizations.entity';
import { Users } from 'src/entities/users.entity';
import { CustomizationService } from 'src/services/customizations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customization, Users]),
    JwtModule.register({ secret: jwtConstants.secret, global: true }),
  ],
  providers: [CustomizationService],
  controllers: [CustomizationController],
})
export class CustomizationModule {}
