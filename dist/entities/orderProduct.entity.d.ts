import { Product } from './products.entity';
import { Order } from './orders.entity';
export declare class OrderProduct {
    id: string;
    order: Order;
    product: Product;
    quantity: number;
    price: number;
}
