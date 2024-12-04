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
  state: string;

  @IsString()
  client_Name: string;

  @IsString()
  client_Phone: string;

  @IsString()
  client_Email: string;

  @IsString()
  client_Address: string;

  @IsString()
  type: string;

  @IsObject()
  @Validate((obj: any) => {
    if (typeof obj !== 'object' || Array.isArray(obj)) return false;
    return Object.values(obj).every((value) => typeof value === 'number');
  })
  items: Record<string, number>;
}

export class OrderUpdate {
  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  client_Name?: string;

  @IsOptional()
  @IsString()
  client_Phone?: string;

  @IsOptional()
  @IsString()
  client_Email?: string;

  @IsOptional()
  @IsString()
  client_Address?: string;

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
  client_Name: string;
  client_Phone: string;
  client_Email: string;
  client_Address: string;
  type: string;
  order_Products: OrderProduct[];

  constructor(order: Order) {
    this.id = order.id;
    this.state = order.state;
    this.client_Name = order.client_Name;
    this.client_Phone = order.client_Phone;
    this.client_Email = order.client_Email;
    this.client_Address = order.client_Address;
    this.type = order.type;
    this.order_Products = order.order_Products;
  }
}
