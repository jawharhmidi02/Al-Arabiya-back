import { OrderProduct } from 'src/entities/orderProduct.entity';
import { Order } from 'src/entities/orders.entity';
declare class OrderProductDTO {
    id: string;
}
export declare class OrderCreate {
    last_name: string;
    first_name: string;
    created_At: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    deliveryPrice: number;
    cart: Record<string, number>;
}
export declare class OrderUpdate {
    state?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    email?: string;
    city?: string;
    address?: string;
    deliveryPrice?: number;
    type?: string;
    order_Products?: OrderProductDTO[];
}
export declare class OrderResponse {
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
    constructor(order: Order);
}
export {};
