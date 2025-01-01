import { Product } from './products.entity';
import { Customization } from './customizations.entity';
export declare class Category {
    id: string;
    name: string;
    products: Product[];
    customization: Customization;
}
