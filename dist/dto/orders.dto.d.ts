import { OrderProduct } from 'src/entities/orderProduct.entity';
import { Order } from 'src/entities/orders.entity';
declare class OrderProductDTO {
    id: string;
}
export declare class OrderCreate {
    state: string;
    client_Name: string;
    client_Phone: string;
    client_Email: string;
    client_Address: string;
    type: string;
    items: Record<string, number>;
}
export declare class OrderUpdate {
    state?: string;
    client_Name?: string;
    client_Phone?: string;
    client_Email?: string;
    client_Address?: string;
    type?: string;
    order_Products?: OrderProductDTO[];
}
export declare class OrderResponse {
    id: string;
    state: string;
    client_Name: string;
    client_Phone: string;
    client_Email: string;
    client_Address: string;
    type: string;
    order_Products: OrderProduct[];
    constructor(order: Order);
}
export {};
