import { JwtService } from '@nestjs/jwt';
import { Customization } from 'src/entities/customizations.entity';
import { Repository } from 'typeorm';
import { CustomizationCreate, CustomizationResponse, CustomizationUpdate } from 'src/dto/customizations.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';
export declare class CustomizationService {
    private customizationRepository;
    private jwtService;
    private usersRepository;
    constructor(customizationRepository: Repository<Customization>, jwtService: JwtService, usersRepository: Repository<Users>);
    create(customization: CustomizationCreate, access_token?: string): Promise<ApiResponse<CustomizationResponse>>;
    find(): Promise<ApiResponse<CustomizationResponse>>;
    findById(id: string): Promise<ApiResponse<CustomizationResponse>>;
    update(id: string, customization: CustomizationUpdate, access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    delete(id: string, access_token: string): Promise<ApiResponse<CustomizationResponse>>;
}
