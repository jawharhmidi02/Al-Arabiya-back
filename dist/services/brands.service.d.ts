import { JwtService } from '@nestjs/jwt';
import { Brand } from 'src/entities/brands.entity';
import { Repository } from 'typeorm';
import { BrandCreate, BrandResponse, BrandUpdate } from 'src/dto/brands.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';
export declare class BrandService {
    private categoryRepository;
    private jwtService;
    private usersRepository;
    constructor(categoryRepository: Repository<Brand>, jwtService: JwtService, usersRepository: Repository<Users>);
    create(category: BrandCreate, access_token?: string): Promise<ApiResponse<BrandResponse>>;
    findAll(page?: number, limit?: number): Promise<ApiResponse<{
        data: BrandResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findById(id: string): Promise<ApiResponse<BrandResponse>>;
    findByName(name: string): Promise<ApiResponse<BrandResponse[]>>;
    update(id: string, category: BrandUpdate, access_token: string): Promise<ApiResponse<BrandResponse>>;
    delete(id: string, access_token: string): Promise<ApiResponse<BrandResponse>>;
}
