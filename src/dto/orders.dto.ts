import {
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
  phone: string;

  @IsString()
  email: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

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
  @IsString()
  type?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderProductDTO)
  order_Products?: OrderProductDTO[];
}

export class OrderResponse {
  id: string;
  state: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  type: string;
  order_Products: OrderProduct[];

  constructor(order: Order) {
    this.id = order.id;
    this.state = order.state;
    this.first_name = order.first_name;
    this.last_name = order.last_name;
    this.phone = order.phone;
    this.email = order.email;
    this.city = order.city;
    this.address = order.address;
    this.type = order.type;
    this.order_Products = order.order_Products;
  }
}
