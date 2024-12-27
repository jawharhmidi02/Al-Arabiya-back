import { Category } from 'src/entities/categories.entity';
import { Product } from 'src/entities/products.entity';
export declare class CategoryCreate {
    name: string;
}
export declare class CategoryUpdate {
    name: string;
}
export declare class CategoryResponse {
    id: string;
    name: string;
    products?: Product[];
    constructor(category: Category);
}
