import { JwtService } from '@nestjs/jwt';
import { SpecialOffer } from 'src/entities/specialOffers.entity';
import { Repository } from 'typeorm';
import { SpecialOfferCreate, SpecialOfferResponse, SpecialOfferUpdate } from 'src/dto/specialOffers.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';
export declare class SpecialOfferService {
    private specialOfferRepository;
    private jwtService;
    private usersRepository;
    constructor(specialOfferRepository: Repository<SpecialOffer>, jwtService: JwtService, usersRepository: Repository<Users>);
    create(specialOffer: SpecialOfferCreate, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    findAll(page?: number, limit?: number): Promise<ApiResponse<{
        data: SpecialOfferResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findById(id: string): Promise<ApiResponse<SpecialOfferResponse>>;
    update(id: string, specialOffer: SpecialOfferUpdate, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    delete(id: string, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
}
