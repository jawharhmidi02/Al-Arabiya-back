import {
  IsString,
  IsArray,
  IsObject,
  IsNumber,
  IsUUID,
  ValidateNested,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Product } from 'src/entities/products.entity';
import { Category } from 'src/entities/categories.entity';
import { Type } from 'class-transformer';
import { Brand } from 'src/entities/brands.entity';
import { OrderProduct } from 'src/entities/orderProduct.entity';

class CategoryDTO {
  @IsUUID()
  id: string;
}

class BrandDTO {
  @IsUUID()
  id: string;
}

export class ProductCreate {
  @IsString()
  name: string;

  @IsArray()
  img: string[];

  @IsString()
  description: string;

  @IsNumber()
  normalSinglePrice: number;

  @IsNumber()
  normalMultiPrice: number;

  @IsBoolean()
  in_Stock: boolean;

  @IsBoolean()
  onSold: boolean;

  @IsOptional()
  @IsNumber()
  soldPercentage?: number;

  @IsOptional()
  @IsNumber()
  soldSinglePrice?: number;

  @IsOptional()
  @IsNumber()
  soldMultiPrice?: number;

  @ValidateNested()
  @Type(() => CategoryDTO)
  category: CategoryDTO;

  @ValidateNested()
  @Type(() => BrandDTO)
  brand: BrandDTO;
}

export class ProductUpdate {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray({ each: true })
  img?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  onSold?: boolean;

  @IsOptional()
  @IsNumber()
  soldPercentage?: number;

  @IsOptional()
  @IsNumber()
  normalSinglePrice?: number;

  @IsOptional()
  @IsNumber()
  soldSinglePrice?: number;

  @IsOptional()
  @IsNumber()
  normalMultiPrice?: number;

  @IsOptional()
  @IsNumber()
  soldMultiPrice?: number;

  @IsOptional()
  @IsBoolean()
  in_Stock?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryDTO)
  category?: CategoryDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => BrandDTO)
  brand?: BrandDTO;
}

export class ProductResponse {
  id: string;
  name: string;
  img: string[];
  description: string;
  onSold: boolean;
  soldPercentage: number;
  created_At: Date;
  normalSinglePrice: number;
  soldSinglePrice: number;
  normalMultiPrice: number;
  soldMultiPrice: number;
  in_Stock: boolean;
  category: Category;
  brand: Brand;
  orderProducts?: OrderProduct[];

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.img = product.img;
    this.description = product.description;
    this.onSold = product.onSold;
    this.soldPercentage = product.soldPercentage;
    this.created_At = product.created_At;
    this.normalSinglePrice = product.normalSinglePrice;
    this.soldSinglePrice = product.soldSinglePrice;
    this.normalMultiPrice = product.normalMultiPrice;
    this.soldMultiPrice = product.soldMultiPrice;
    this.in_Stock = product.in_Stock;
    this.category = product.category;
    this.brand = product.brand;
    this.orderProducts = product.orderProducts;
  }
}
