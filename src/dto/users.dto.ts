import { Users } from 'src/entities/users.entity';
import {
  IsString,
  IsObject,
  Validate,
  IsUUID,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Order } from 'src/entities/orders.entity';
import { Type } from 'class-transformer';

class OrderDTO {
  @IsUUID()
  id: string;
}

export class UsersCreate {
  @IsString()
  full_name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;
}

export class UsersUpdate {
  @IsString()
  full_name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

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

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderDTO)
  orders: OrderDTO[];

  @IsString()
  role: string;

  @IsString()
  nonce: string;
}

export class UsersResponse {
  id: string;

  full_name: string;

  email: string;

  password: string;

  phone: string;

  city: string;

  address: string;

  cart: Record<string, number>;

  orders: Order[];

  role: string;

  nonce: string;

  constructor(user: Users) {
    this.email = user.email;
    this.id = user.id;
    this.full_name = user.full_name;
    this.phone = user.phone;
    this.city = user.city;
    this.address = user.address;
    this.cart = user.cart;
    this.orders = user.orders;
    this.role = user.role;
    this.nonce = user.nonce;
  }
}
