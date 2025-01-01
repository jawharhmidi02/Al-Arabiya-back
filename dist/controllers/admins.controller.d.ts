import { AdminService } from '../services/admins.service';
import { UsersUpdate, UsersResponse } from 'src/dto/users.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { CategoryCreate, CategoryResponse, CategoryUpdate } from 'src/dto/categories.dto';
import { BrandCreate, BrandResponse, BrandUpdate } from 'src/dto/brands.dto';
import { ProductCreate, ProductResponse, ProductUpdate } from 'src/dto/products.dto';
import { OrderCreate, OrderResponse, OrderUpdate } from 'src/dto/orders.dto';
import { SpecialOfferCreate, SpecialOfferResponse, SpecialOfferUpdate } from 'src/dto/specialOffers.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    SignIn(email: string, password: string): Promise<ApiResponse<{
        access_token: string;
    }>>;
    getAccount(access_token: string): Promise<ApiResponse<UsersResponse>>;
    sendRecoverPass(email: string): Promise<ApiResponse<any>>;
    changePasswordFromRecover(access_token: string, password: string): Promise<ApiResponse<UsersResponse>>;
    getRecoverPassHtml(access_token: string): Promise<string>;
    findAllUser(access_token: string): Promise<ApiResponse<UsersResponse[]>>;
    findByIdUser(id: string, access_token: string): Promise<ApiResponse<UsersResponse>>;
    updateUser(id: string, access_token: string, user: UsersUpdate): Promise<ApiResponse<UsersResponse>>;
    deleteUser(id: string, access_token: string): Promise<ApiResponse<UsersResponse>>;
    createCategory(categoryDto: CategoryCreate, access_token: string): Promise<ApiResponse<CategoryResponse>>;
    findAllCategory(page: number, limit: number, name: string, access_token: string): Promise<ApiResponse<{
        data: CategoryResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdCategory(id: string, access_token: string): Promise<ApiResponse<CategoryResponse>>;
    findByNameCategory(name: string, access_token: string): Promise<ApiResponse<CategoryResponse[]>>;
    updateCategory(id: string, category: CategoryUpdate, access_token: string): Promise<ApiResponse<CategoryResponse>>;
    deleteCategory(id: string, access_token: string): Promise<ApiResponse<CategoryResponse>>;
    createBrand(brandDto: BrandCreate, access_token?: string): Promise<ApiResponse<BrandResponse>>;
    findAllBrand(page: number, limit: number, name: string, access_token: string): Promise<ApiResponse<{
        data: BrandResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdBrand(id: string, access_token: string): Promise<ApiResponse<BrandResponse>>;
    findByNameBrand(name: string, access_token: string): Promise<ApiResponse<BrandResponse[]>>;
    updateBrand(id: string, brand: BrandUpdate, access_token: string): Promise<ApiResponse<BrandResponse>>;
    deleteBrand(id: string, access_token: string): Promise<ApiResponse<BrandResponse>>;
    createProduct(productDto: ProductCreate, access_token: string): Promise<ApiResponse<ProductResponse>>;
    createByListProduct(productDto: any, access_token?: string): Promise<ApiResponse<ProductResponse[]>>;
    findAllProduct(page: number, limit: number, access_token: string): Promise<ApiResponse<{
        data: ProductResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdProduct(id: string, access_token: string): Promise<ApiResponse<ProductResponse>>;
    findByNameProduct(name: string, access_token: string): Promise<ApiResponse<ProductResponse[]>>;
    findMostPopularProduct(page: number, limit: number, access_token: string): Promise<ApiResponse<{
        data: ProductResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    searchProduct(page: number, limit: number, sortBy: 'date' | 'alpha' | 'price', sortOrder: 'asc' | 'desc', access_token: string, name?: string, categories?: string, brand?: string, min_price?: number, max_price?: number): Promise<ApiResponse<{
        data: ProductResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    updateProduct(id: string, product: ProductUpdate, access_token: string): Promise<ApiResponse<ProductResponse>>;
    deleteProduct(id: string, access_token: string): Promise<ApiResponse<ProductResponse>>;
    createOrder(orderDto: OrderCreate, access_token: string): Promise<ApiResponse<OrderResponse>>;
    findAllOrder(page: number, limit: number, access_token: string): Promise<ApiResponse<{
        data: OrderResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdOrder(id: string, access_token: string): Promise<ApiResponse<OrderResponse>>;
    updateOrder(id: string, order: OrderUpdate, access_token: string): Promise<ApiResponse<OrderResponse>>;
    deleteOrder(id: string, access_token: string): Promise<ApiResponse<OrderResponse>>;
    createSpecialOffer(specialOfferDto: SpecialOfferCreate, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    findAllSpecialOffer(page: number, limit: number, access_token: string): Promise<ApiResponse<{
        data: SpecialOfferResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdSpecialOffer(id: string, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    updateSpecialOffer(id: string, specialOffer: SpecialOfferUpdate, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    deleteSpecialOffer(id: string, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
}
