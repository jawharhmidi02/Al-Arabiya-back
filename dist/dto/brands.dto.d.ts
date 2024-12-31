import { Brand } from 'src/entities/brands.entity';
import { Product } from 'src/entities/products.entity';
export declare class BrandCreate {
    name: string;
    img: string;
}
export declare class BrandUpdate {
    name: string;
    img: string;
}
export declare class BrandResponse {
    id: string;
    name: string;
    img: string;
    productCount?: number;
    products?: Product[];
    constructor(brand: Brand);
}
