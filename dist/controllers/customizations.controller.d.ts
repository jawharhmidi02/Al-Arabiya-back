import { ApiResponse } from 'src/common/interfaces/response.interface';
import { CustomizationCreate, CustomizationResponse, CustomizationUpdate } from 'src/dto/customizations.dto';
import { CustomizationService } from 'src/services/customizations.service';
export declare class CustomizationController {
    private readonly customizationService;
    constructor(customizationService: CustomizationService);
    create(customizationDto: CustomizationCreate, access_token?: string): Promise<ApiResponse<CustomizationResponse>>;
    find(): Promise<ApiResponse<CustomizationResponse>>;
    findById(id: string): Promise<ApiResponse<CustomizationResponse>>;
    update(id: string, customization: CustomizationUpdate, access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    delete(id: string, access_token: string): Promise<ApiResponse<CustomizationResponse>>;
}
