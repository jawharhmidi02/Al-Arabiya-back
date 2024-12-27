import { ApiResponse } from 'src/common/interfaces/response.interface';
import { ProductCreate, ProductResponse, ProductUpdate } from 'src/dto/products.dto';
import { ProductService } from 'src/services/products.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(productDto: ProductCreate, access_token?: string): Promise<ApiResponse<ProductResponse>>;
    createByList(productDto: any, access_token?: string): Promise<ApiResponse<ProductResponse[]>>;
    findAll(page: number, limit: number): Promise<ApiResponse<{
        data: ProductResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findById(id: string): Promise<ApiResponse<ProductResponse>>;
    findByName(name: string): Promise<ApiResponse<ProductResponse[]>>;
    search(page?: number, limit?: number, sortBy?: 'date' | 'alpha' | 'price', sortOrder?: 'asc' | 'desc', name?: string, categories?: string, brand?: string, min_price?: number, max_price?: number): Promise<ApiResponse<{
        data: ProductResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    update(id: string, product: ProductUpdate, access_token: string): Promise<ApiResponse<ProductResponse>>;
    delete(id: string, access_token: string): Promise<ApiResponse<ProductResponse>>;
}
