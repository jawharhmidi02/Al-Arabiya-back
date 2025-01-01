import { Category } from './categories.entity';
import { Brand } from './brands.entity';
import { OrderProduct } from './orderProduct.entity';
import { Customization } from './customizations.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    img: string[];
    onSold: boolean;
    soldPercentage: number;
    normalSinglePrice: number;
    soldSinglePrice: number;
    normalMultiPrice: number;
    soldMultiPrice: number;
    in_Stock: boolean;
    created_At: Date;
    category: Category;
    brand: Brand;
    orderProducts: OrderProduct[];
    customization: Customization;
}
