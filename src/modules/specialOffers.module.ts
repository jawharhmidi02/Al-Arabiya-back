import { SpecialOfferController } from '../controllers/specialOffers.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/constants/jwt.constant';
import { SpecialOffer } from 'src/entities/specialOffers.entity';
import { Users } from 'src/entities/users.entity';
import { SpecialOfferService } from 'src/services/specialOffers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpecialOffer, Users]),
    JwtModule.register({ secret: jwtConstants.secret, global: true }),
  ],
  providers: [SpecialOfferService],
  controllers: [SpecialOfferController],
})
export class SpecialOfferModule {}
