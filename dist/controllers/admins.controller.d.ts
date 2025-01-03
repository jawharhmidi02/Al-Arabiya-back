import { AdminService } from '../services/admins.service';
import { UsersUpdate, UsersResponse } from 'src/dto/users.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { CategoryCreate, CategoryResponse, CategoryUpdate } from 'src/dto/categories.dto';
import { BrandCreate, BrandResponse, BrandUpdate } from 'src/dto/brands.dto';
import { ProductCreate, ProductResponse, ProductUpdate } from 'src/dto/products.dto';
import { OrderCreate, OrderResponse, OrderUpdate } from 'src/dto/orders.dto';
import { SpecialOfferCreate, SpecialOfferResponse, SpecialOfferUpdate } from 'src/dto/specialOffers.dto';
import { CustomizationCreate, CustomizationResponse, CustomizationUpdate } from 'src/dto/customizations.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    SignIn(email: string, password: string): Promise<ApiResponse<{
        admin_access_token: string;
    }>>;
    getAccount(admin_access_token: string): Promise<ApiResponse<UsersResponse>>;
    sendRecoverPass(email: string): Promise<ApiResponse<any>>;
    changePasswordFromRecover(admin_access_token: string, password: string): Promise<ApiResponse<UsersResponse>>;
    getRecoverPassHtml(admin_access_token: string): Promise<string>;
    findAllUser(admin_access_token: string): Promise<ApiResponse<UsersResponse[]>>;
    findByIdUser(id: string, admin_access_token: string): Promise<ApiResponse<UsersResponse>>;
    updateUser(id: string, admin_access_token: string, user: UsersUpdate): Promise<ApiResponse<UsersResponse>>;
    deleteUser(id: string, admin_access_token: string): Promise<ApiResponse<UsersResponse>>;
    createCategory(categoryDto: CategoryCreate, admin_access_token: string): Promise<ApiResponse<CategoryResponse>>;
    findAllCategory(page: number, limit: number, name: string, admin_access_token: string): Promise<ApiResponse<{
        data: CategoryResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdCategory(id: string, admin_access_token: string): Promise<ApiResponse<CategoryResponse>>;
    findByNameCategory(name: string, admin_access_token: string): Promise<ApiResponse<CategoryResponse[]>>;
    updateCategory(id: string, category: CategoryUpdate, admin_access_token: string): Promise<ApiResponse<CategoryResponse>>;
    deleteCategory(id: string, admin_access_token: string): Promise<ApiResponse<CategoryResponse>>;
    createBrand(brandDto: BrandCreate, admin_access_token?: string): Promise<ApiResponse<BrandResponse>>;
    findAllBrand(page: number, limit: number, name: string, admin_access_token: string): Promise<ApiResponse<{
        data: BrandResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdBrand(id: string, admin_access_token: string): Promise<ApiResponse<BrandResponse>>;
    findByNameBrand(name: string, admin_access_token: string): Promise<ApiResponse<BrandResponse[]>>;
    updateBrand(id: string, brand: BrandUpdate, admin_access_token: string): Promise<ApiResponse<BrandResponse>>;
    deleteBrand(id: string, admin_access_token: string): Promise<ApiResponse<BrandResponse>>;
    createProduct(productDto: ProductCreate, admin_access_token: string): Promise<ApiResponse<ProductResponse>>;
    createByListProduct(productDto: any, admin_access_token?: string): Promise<ApiResponse<ProductResponse[]>>;
    findAllProduct(page: number, limit: number, name: string, admin_access_token: string): Promise<ApiResponse<{
        data: ProductResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdProduct(id: string, admin_access_token: string): Promise<ApiResponse<ProductResponse>>;
    findByNameProduct(name: string, admin_access_token: string): Promise<ApiResponse<ProductResponse[]>>;
    findMostPopularProduct(page: number, limit: number, admin_access_token: string): Promise<ApiResponse<{
        data: ProductResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    searchProduct(page: number, limit: number, sortBy: 'date' | 'alpha' | 'price', sortOrder: 'asc' | 'desc', admin_access_token: string, name?: string, categories?: string, brand?: string, min_price?: number, max_price?: number): Promise<ApiResponse<{
        data: ProductResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    updateProduct(id: string, product: ProductUpdate, admin_access_token: string): Promise<ApiResponse<ProductResponse>>;
    deleteProduct(id: string, admin_access_token: string): Promise<ApiResponse<ProductResponse>>;
    createOrder(orderDto: OrderCreate, admin_access_token: string): Promise<ApiResponse<OrderResponse>>;
    findAllOrder(page: number, limit: number, admin_access_token: string): Promise<ApiResponse<{
        data: OrderResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdOrder(id: string, admin_access_token: string): Promise<ApiResponse<OrderResponse>>;
    updateOrder(id: string, order: OrderUpdate, admin_access_token: string): Promise<ApiResponse<OrderResponse>>;
    deleteOrder(id: string, admin_access_token: string): Promise<ApiResponse<OrderResponse>>;
    createSpecialOffer(specialOfferDto: SpecialOfferCreate, admin_access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    findAllSpecialOffer(page: number, limit: number, admin_access_token: string): Promise<ApiResponse<{
        data: SpecialOfferResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdSpecialOffer(id: string, admin_access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    updateSpecialOffer(id: string, specialOffer: SpecialOfferUpdate, admin_access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    deleteSpecialOffer(id: string, admin_access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    createCustomization(customizationDto: CustomizationCreate, admin_access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    findCustomization(admin_access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    findByIdCustomization(id: string, admin_access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    updateCustomization(id: string, customization: CustomizationUpdate, admin_access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    deleteCustomization(id: string, admin_access_token: string): Promise<ApiResponse<CustomizationResponse>>;
}
