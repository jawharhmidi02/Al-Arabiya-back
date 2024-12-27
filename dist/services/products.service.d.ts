import { JwtService } from '@nestjs/jwt';
import { Product } from 'src/entities/products.entity';
import { Repository } from 'typeorm';
import { ProductCreate, ProductResponse, ProductUpdate } from 'src/dto/products.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';
export declare class ProductService {
    private productRepository;
    private jwtService;
    private usersRepository;
    constructor(productRepository: Repository<Product>, jwtService: JwtService, usersRepository: Repository<Users>);
    create(product: ProductCreate, access_token?: string): Promise<ApiResponse<ProductResponse>>;
    createByList(product: any, access_token?: string): Promise<ApiResponse<ProductResponse[]>>;
    findAll(page?: number, limit?: number): Promise<ApiResponse<{
        data: ProductResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findById(id: string): Promise<ApiResponse<ProductResponse>>;
    findByName(name: string): Promise<ApiResponse<ProductResponse[]>>;
    search(page: number, limit: number, sortBy: 'date' | 'alpha' | 'price', sortOrder: 'asc' | 'desc', filters: {
        name?: string;
        categories?: string;
        brand?: string;
        min_price?: number;
        max_price?: number;
    }): Promise<ApiResponse<{
        data: ProductResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    update(id: string, product: ProductUpdate, access_token: string): Promise<ApiResponse<ProductResponse>>;
    delete(id: string, access_token: string): Promise<ApiResponse<ProductResponse>>;
}
