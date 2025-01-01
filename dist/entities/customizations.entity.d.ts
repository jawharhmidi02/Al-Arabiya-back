import { Brand } from './brands.entity';
import { Category } from './categories.entity';
import { Product } from './products.entity';
export declare class Customization {
    id: string;
    deliveryPrice: number;
    featuredProducts: Product[];
    categories: Category[];
    brands: Brand[];
}
