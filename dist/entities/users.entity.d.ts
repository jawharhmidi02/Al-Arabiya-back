import { Order } from './orders.entity';
export declare class Users {
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
}
