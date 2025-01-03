import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
  ValidateNested,
} from 'class-validator';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { Type } from 'class-transformer';
import { Order } from 'src/entities/orders.entity';

class OrderProductDTO {
  @IsUUID()
  id: string;
}

export class OrderCreate {
  @IsString()
  last_name: string;

  @IsString()
  first_name: string;

  @IsString()
  created_At: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsNumber()
  deliveryPrice: number;

  @IsObject()
  @Validate((obj: any) => {
    if (typeof obj !== 'object' || Array.isArray(obj)) return false;
    return Object.values(obj).every((value) => typeof value === 'number');
  })
  cart: Record<string, number>;
}

export class OrderUpdate {
  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  deliveryPrice?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderProductDTO)
  order_Products?: OrderProductDTO[];
}

export class OrderResponse {
  id: string;
  created_At: Date;
  state: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  deliveryPrice: number;
  type: string;
  order_Products: OrderProduct[];

  constructor(order: Order) {
    this.id = order.id;
    this.state = order.state;
    this.created_At = order.created_At;
    this.first_name = order.first_name;
    this.last_name = order.last_name;
    this.phone = order.phone;
    this.email = order.email;
    this.city = order.city;
    this.address = order.address;
    this.deliveryPrice = order.deliveryPrice;
    this.type = order.type;
    this.order_Products = order.order_Products;
  }
}
