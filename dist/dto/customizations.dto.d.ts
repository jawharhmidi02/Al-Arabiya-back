import { Customization } from 'src/entities/customizations.entity';
declare class CategoryDTO {
    id: string;
}
declare class BrandDTO {
    id: string;
}
declare class ProductDTO {
    id: string;
}
export declare class CustomizationCreate {
    deliveryPrice: number;
    featuredProducts: ProductDTO[];
    categories: CategoryDTO[];
    brands: BrandDTO[];
}
export declare class CustomizationUpdate {
    deliveryPrice?: number;
    featuredProducts?: ProductDTO[];
    categories?: CategoryDTO[];
    brands?: BrandDTO[];
}
export declare class CustomizationResponse {
    id: string;
    deliveryPrice: number;
    featuredProducts: ProductDTO[];
    categories: CategoryDTO[];
    brands: BrandDTO[];
    constructor(customization: Customization);
}
export {};
