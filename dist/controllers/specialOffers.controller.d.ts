import { ApiResponse } from 'src/common/interfaces/response.interface';
import { SpecialOfferCreate, SpecialOfferResponse, SpecialOfferUpdate } from 'src/dto/specialOffers.dto';
import { SpecialOfferService } from 'src/services/specialOffers.service';
export declare class SpecialOfferController {
    private readonly specialOfferService;
    constructor(specialOfferService: SpecialOfferService);
    create(specialOfferDto: SpecialOfferCreate, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    findAll(page: number, limit: number): Promise<ApiResponse<{
        data: SpecialOfferResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findById(id: string): Promise<ApiResponse<SpecialOfferResponse>>;
    update(id: string, specialOffer: SpecialOfferUpdate, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    delete(id: string, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
}
