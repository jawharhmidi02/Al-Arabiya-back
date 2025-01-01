import { ApiResponse } from 'src/common/interfaces/response.interface';
import { BrandCreate, BrandResponse, BrandUpdate } from 'src/dto/brands.dto';
import { BrandService } from 'src/services/brands.service';
export declare class BrandController {
    private readonly brandService;
    constructor(brandService: BrandService);
    create(brandDto: BrandCreate, access_token?: string): Promise<ApiResponse<BrandResponse>>;
    findAll(page: number, limit: number): Promise<ApiResponse<{
        data: BrandResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findById(id: string): Promise<ApiResponse<BrandResponse>>;
    findByName(name: string): Promise<ApiResponse<BrandResponse[]>>;
    update(id: string, brand: BrandUpdate, access_token: string): Promise<ApiResponse<BrandResponse>>;
    delete(id: string, access_token: string): Promise<ApiResponse<BrandResponse>>;
}
