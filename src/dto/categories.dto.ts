import { Category } from 'src/entities/categories.entity';
import { IsString } from 'class-validator';
import { Product } from 'src/entities/products.entity';

export class CategoryCreate {
  @IsString()
  name: string;
}

export class CategoryUpdate {
  @IsString()
  name: string;
}

export class CategoryResponse {
  id: string;
  name: string;
  products?: Product[];

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.products = category.products;
  }
}
