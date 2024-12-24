import { ApiResponse } from 'src/common/interfaces/response.interface';
import { CategoryCreate, CategoryResponse, CategoryUpdate } from 'src/dto/categories.dto';
import { CategoryService } from 'src/services/categories.service';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(categoryDto: CategoryCreate, access_token?: string): Promise<ApiResponse<CategoryResponse>>;
    findAll(page: number, limit: number): Promise<ApiResponse<{
        data: CategoryResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findById(id: string): Promise<ApiResponse<CategoryResponse>>;
    findByName(name: string): Promise<ApiResponse<CategoryResponse[]>>;
    update(id: string, category: CategoryUpdate, access_token: string): Promise<ApiResponse<CategoryResponse>>;
    delete(id: string, access_token: string): Promise<ApiResponse<CategoryResponse>>;
}
