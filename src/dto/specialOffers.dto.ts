import { SpecialOffer } from 'src/entities/specialOffers.entity';
import { IsString } from 'class-validator';

export class SpecialOfferCreate {
  @IsString()
  href: string;

  @IsString()
  img: string;
}

export class SpecialOfferUpdate {
  @IsString()
  href: string;

  @IsString()
  img: string;
}

export class SpecialOfferResponse {
  id: string;
  href: string;
  img: string;

  constructor(specialOffer: SpecialOffer) {
    this.id = specialOffer.id;
    this.img = specialOffer.img;
    this.href = specialOffer.href;
  }
}
