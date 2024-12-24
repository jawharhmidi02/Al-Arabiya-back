import { Category } from './categories.entity';
import { Brand } from './brands.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    img: string;
    normalSinglePrice: number;
    soldSinglePrice: number;
    normalMultiPrice: number;
    soldMultiPrice: number;
    in_Stock: boolean;
    created_At: Date;
    category: Category[];
    brand: Brand;
}
