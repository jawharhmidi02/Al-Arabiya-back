import { Product } from 'src/entities/products.entity';
import { Category } from 'src/entities/categories.entity';
import { Brand } from 'src/entities/brands.entity';
declare class CategoryDTO {
    id: string;
}
declare class BrandDTO {
    id: string;
}
export declare class ProductCreate {
    name: string;
    img: string;
    description: string;
    normalSinglePrice: number;
    soldSinglePrice: number;
    normalMultiPrice: number;
    soldMultiPrice: number;
    in_Stock: boolean;
    category: CategoryDTO[];
    brand: BrandDTO;
}
export declare class ProductUpdate {
    name?: string;
    img?: string;
    description?: string;
    normalSinglePrice?: number;
    soldSinglePrice?: number;
    normalMultiPrice?: number;
    soldMultiPrice?: number;
    in_Stock?: boolean;
    category?: CategoryDTO[];
    brand?: BrandDTO;
}
export declare class ProductResponse {
    id: string;
    name: string;
    img: string;
    description: string;
    created_At: Date;
    normalSinglePrice: number;
    soldSinglePrice: number;
    normalMultiPrice: number;
    soldMultiPrice: number;
    in_Stock: boolean;
    category: Category[];
    brand: Brand;
    constructor(product: Product);
}
export {};
