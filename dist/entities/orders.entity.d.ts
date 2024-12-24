import { OrderProduct } from './orderProduct.entity';
export declare class Order {
    id: string;
    state: string;
    created_At: Date;
    client_Name: string;
    client_Phone: string;
    client_Email: string;
    client_Address: string;
    type: string;
    order_Products: OrderProduct[];
}
