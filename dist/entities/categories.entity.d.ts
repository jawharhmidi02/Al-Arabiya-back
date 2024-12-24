import { Product } from './products.entity';
export declare class Category {
    id: string;
    name: string;
    img: string;
    products: Promise<Product[]>;
}
