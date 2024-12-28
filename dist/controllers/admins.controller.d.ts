import { AdminService } from '../services/admins.service';
import { UsersUpdate, UsersCreate, UsersResponse } from 'src/dto/users.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
export declare class AdminController {
    private readonly userService;
    constructor(userService: AdminService);
    signUp(user: UsersCreate): Promise<ApiResponse<UsersResponse>>;
    SignIn(email: string, password: string): Promise<ApiResponse<{
        access_token: string;
    }>>;
    findAll(access_token: string): Promise<ApiResponse<UsersResponse[]>>;
    findById(id: string, access_token: string): Promise<ApiResponse<UsersResponse>>;
    getAccount(access_token: string): Promise<ApiResponse<UsersResponse>>;
    update(id: string, access_token: string, user: UsersUpdate): Promise<ApiResponse<UsersResponse>>;
    remove(id: string, access_token: string): Promise<ApiResponse<UsersResponse>>;
    sendRecoverPass(email: string): Promise<ApiResponse<any>>;
    changePasswordFromRecover(access_token: string, password: string): Promise<ApiResponse<UsersResponse>>;
    getRecoverPassHtml(access_token: string): Promise<string>;
}
