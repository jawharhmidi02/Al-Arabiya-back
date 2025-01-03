import { Product } from './products.entity';
import { Customization } from './customizations.entity';
export declare class Brand {
    id: string;
    name: string;
    img: string;
    products: Product[];
    customization: Customization;
}
