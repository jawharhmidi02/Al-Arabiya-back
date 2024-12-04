import { Category } from 'src/entities/categories.entity';
import { IsString, IsNumber } from 'class-validator';
import { Product } from 'src/entities/products.entity';

export class CategoryCreate {
  @IsString()
  name: string;

  @IsString()
  img: string;
}

export class CategoryUpdate {
  @IsString()
  name: string;

  @IsString()
  img: string;
}

export class CategoryResponse {
  id: string;
  name: string;
  img: string;
  products: Product[];

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.img = category.img;
  }
}
