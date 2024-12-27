import { Brand } from 'src/entities/brands.entity';
import { IsString, IsNumber } from 'class-validator';
import { Product } from 'src/entities/products.entity';

export class BrandCreate {
  @IsString()
  name: string;

  @IsString()
  img: string;
}

export class BrandUpdate {
  @IsString()
  name: string;

  @IsString()
  img: string;
}

export class BrandResponse {
  id: string;
  name: string;
  img: string;
  products?: Product[];

  constructor(brand: Brand) {
    this.id = brand.id;
    this.name = brand.name;
    this.img = brand.img;
    this.products = brand.products;
  }
}
