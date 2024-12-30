import { OrderProduct } from './orderProduct.entity';
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
    type: string;
    order_Products: OrderProduct[];
}
