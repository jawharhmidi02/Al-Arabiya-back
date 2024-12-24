import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { UsersCreate, UsersResponse, UsersUpdate } from 'src/dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse } from 'src/common/interfaces/response.interface';
export declare class UsersService {
    private usersRepository;
    private jwtService;
    private transporter;
    constructor(usersRepository: Repository<Users>, jwtService: JwtService);
    signup(user: UsersCreate): Promise<ApiResponse<UsersResponse>>;
    signin(email: string, password: string): Promise<ApiResponse<{
        access_token: string;
    }>>;
    findAll(access_token: string): Promise<ApiResponse<UsersResponse[]>>;
    findById(id: string, access_token: string): Promise<ApiResponse<UsersResponse>>;
    getAccount(token: string): Promise<ApiResponse<UsersResponse>>;
    update(id: string, user: UsersUpdate, access_token: string): Promise<ApiResponse<UsersResponse>>;
    remove(id: string, access_token: string): Promise<ApiResponse<UsersResponse>>;
    sendRecoverPassViaEmail(email: string): Promise<ApiResponse<any>>;
    recoverPageHtml(access_token: string): Promise<string>;
    changePasswordFromRecover(access_token: string, newPassword: string): Promise<ApiResponse<UsersResponse>>;
}
