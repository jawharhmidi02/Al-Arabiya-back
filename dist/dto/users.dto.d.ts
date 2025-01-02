import { Users } from 'src/entities/users.entity';
import { Order } from 'src/entities/orders.entity';
declare class OrderDTO {
    id: string;
}
export declare class UsersCreate {
    full_name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    city: string;
}
export declare class UsersUpdate {
    full_name?: string;
    email?: string;
    password?: string;
    current_password?: string;
    phone?: string;
    city?: string;
    address?: string;
    cart?: Record<string, number>;
    orders?: OrderDTO[];
    role?: string;
    nonce?: string;
}
export declare class UsersResponse {
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
    constructor(user: Users);
}
export {};
