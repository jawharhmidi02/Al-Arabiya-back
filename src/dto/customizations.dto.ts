import { Customization } from 'src/entities/customizations.entity';
import {
  IsString,
  IsNumber,
  IsUUID,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Product } from 'src/entities/products.entity';
import { Type } from 'class-transformer';

class CategoryDTO {
  @IsUUID()
  id: string;
}

class BrandDTO {
  @IsUUID()
  id: string;
}

class ProductDTO {
  @IsUUID()
  id: string;
}

export class CustomizationCreate {
  @IsNumber()
  deliveryPrice: number;

  @ValidateNested()
  @Type(() => ProductDTO)
  featuredProducts: ProductDTO[];

  @ValidateNested()
  @Type(() => CategoryDTO)
  categories: CategoryDTO[];

  @ValidateNested()
  @Type(() => BrandDTO)
  brands: BrandDTO[];
}

export class CustomizationUpdate {
  @IsOptional()
  @IsNumber()
  deliveryPrice?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductDTO)
  featuredProducts?: ProductDTO[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryDTO)
  categories?: CategoryDTO[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BrandDTO)
  brands?: BrandDTO[];
}

export class CustomizationResponse {
  id: string;
  deliveryPrice: number;
  featuredProducts: ProductDTO[];
  categories: CategoryDTO[];
  brands: BrandDTO[];

  constructor(customization: Customization) {
    this.id = customization.id;
    this.deliveryPrice = customization.deliveryPrice;
    this.featuredProducts = customization.featuredProducts;
    this.categories = customization.categories;
    this.brands = customization.brands;
  }
}
