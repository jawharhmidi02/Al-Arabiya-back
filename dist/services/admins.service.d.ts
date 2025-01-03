import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { UsersResponse, UsersUpdate } from 'src/dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Category } from 'src/entities/categories.entity';
import { CategoryCreate, CategoryResponse, CategoryUpdate } from 'src/dto/categories.dto';
import { Brand } from 'src/entities/brands.entity';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { Order } from 'src/entities/orders.entity';
import { Product } from 'src/entities/products.entity';
import { BrandCreate, BrandResponse, BrandUpdate } from 'src/dto/brands.dto';
import { ProductCreate, ProductResponse, ProductUpdate } from 'src/dto/products.dto';
import { OrderCreate, OrderResponse, OrderUpdate } from 'src/dto/orders.dto';
import { SpecialOfferCreate, SpecialOfferResponse, SpecialOfferUpdate } from 'src/dto/specialOffers.dto';
import { SpecialOffer } from 'src/entities/specialOffers.entity';
import { Customization } from 'src/entities/customizations.entity';
import { CustomizationCreate, CustomizationResponse, CustomizationUpdate } from 'src/dto/customizations.dto';
export declare class AdminService {
    private usersRepository;
    private categoryRepository;
    private brandRepository;
    private orderRepository;
    private orderProductRepository;
    private productRepository;
    private specialOfferRepository;
    private customizationRepository;
    private jwtService;
    private transporter;
    constructor(usersRepository: Repository<Users>, categoryRepository: Repository<Category>, brandRepository: Repository<Brand>, orderRepository: Repository<Order>, orderProductRepository: Repository<OrderProduct>, productRepository: Repository<Product>, specialOfferRepository: Repository<SpecialOffer>, customizationRepository: Repository<Customization>, jwtService: JwtService);
    private uploadToCloudinary;
    private verifyAdmin;
    signin(email: string, password: string): Promise<ApiResponse<{
        admin_access_token: string;
    }>>;
    getAccount(token: string): Promise<ApiResponse<UsersResponse>>;
    sendRecoverPassViaEmail(email: string): Promise<ApiResponse<any>>;
    recoverPageHtml(admin_access_token: string): Promise<string>;
    changePasswordFromRecover(admin_access_token: string, newPassword: string): Promise<ApiResponse<UsersResponse>>;
    findAllUser(page: number, limit: number, sort: string, order: string, search: string, admin_access_token: string): Promise<ApiResponse<{
        data: UsersResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdUser(id: string, admin_access_token: string): Promise<ApiResponse<UsersResponse>>;
    updateUser(id: string, user: UsersUpdate, admin_access_token: string): Promise<ApiResponse<UsersResponse>>;
    deleteUser(id: string, admin_access_token: string): Promise<ApiResponse<UsersResponse>>;
    createCategory(category: CategoryCreate, admin_access_token: string): Promise<ApiResponse<CategoryResponse>>;
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
    createBrand(brand: BrandCreate, admin_access_token: string): Promise<ApiResponse<BrandResponse>>;
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
    createProduct(product: ProductCreate, admin_access_token: string): Promise<ApiResponse<ProductResponse>>;
    createByListProduct(product: any, admin_access_token: string): Promise<ApiResponse<ProductResponse[]>>;
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
    searchProduct(page: number, limit: number, sortBy: 'date' | 'alpha' | 'price', sortOrder: 'asc' | 'desc', filters: {
        name?: string;
        categories?: string;
        brand?: string;
        min_price?: number;
        max_price?: number;
    }, admin_access_token: string): Promise<ApiResponse<{
        data: ProductResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    updateProduct(id: string, product: ProductUpdate, admin_access_token: string): Promise<ApiResponse<ProductResponse>>;
    deleteProduct(id: string, admin_access_token: string): Promise<ApiResponse<ProductResponse>>;
    createOrder(order: OrderCreate, admin_access_token: string): Promise<ApiResponse<OrderResponse>>;
    findAllOrder(page: number, limit: number, sort: string, order: string, search: string, state: string, admin_access_token: string): Promise<ApiResponse<{
        data: OrderResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdOrder(id: string, admin_access_token: string): Promise<ApiResponse<OrderResponse>>;
    updateOrder(id: string, order: OrderUpdate, admin_access_token: string): Promise<ApiResponse<OrderResponse>>;
    deleteOrder(id: string, admin_access_token: string): Promise<ApiResponse<OrderResponse>>;
    createSpecialOffer(specialOffer: SpecialOfferCreate, admin_access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    findAllSpecialOffer(page: number, limit: number, admin_access_token: string): Promise<ApiResponse<{
        data: SpecialOfferResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdSpecialOffer(id: string, admin_access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    updateSpecialOffer(id: string, specialOffer: SpecialOfferUpdate, admin_access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    deleteSpecialOffer(id: string, admin_access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    createCustomization(customization: CustomizationCreate, admin_access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    findCustomization(admin_access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    findByIdCustomization(id: string, admin_access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    updateCustomization(id: string, customization: CustomizationUpdate, admin_access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    deleteCustomization(id: string, admin_access_token: string): Promise<ApiResponse<CustomizationResponse>>;
}
