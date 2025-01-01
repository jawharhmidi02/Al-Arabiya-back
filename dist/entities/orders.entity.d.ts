import { OrderProduct } from './orderProduct.entity';
import { Users } from './users.entity';
export declare class Order {
    id: string;
    state: string;
    created_At: Date;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    deliveryPrice: number;
    type: string;
    order_Products: OrderProduct[];
    user: Users;
}
