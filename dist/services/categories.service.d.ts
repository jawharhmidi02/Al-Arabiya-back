import { JwtService } from '@nestjs/jwt';
import { Category } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';
import { CategoryCreate, CategoryResponse, CategoryUpdate } from 'src/dto/categories.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';
export declare class CategoryService {
    private categoryRepository;
    private jwtService;
    private usersRepository;
    constructor(categoryRepository: Repository<Category>, jwtService: JwtService, usersRepository: Repository<Users>);
    create(category: CategoryCreate, access_token?: string): Promise<ApiResponse<CategoryResponse>>;
    findAll(page?: number, limit?: number): Promise<ApiResponse<{
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
