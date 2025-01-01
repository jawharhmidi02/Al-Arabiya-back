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
    signin(email: string, password: string): Promise<ApiResponse<{
        access_token: string;
    }>>;
    getAccount(token: string): Promise<ApiResponse<UsersResponse>>;
    sendRecoverPassViaEmail(email: string): Promise<ApiResponse<any>>;
    recoverPageHtml(access_token: string): Promise<string>;
    changePasswordFromRecover(access_token: string, newPassword: string): Promise<ApiResponse<UsersResponse>>;
    findAllUser(access_token: string): Promise<ApiResponse<UsersResponse[]>>;
    findByIdUser(id: string, access_token: string): Promise<ApiResponse<UsersResponse>>;
    updateUser(id: string, user: UsersUpdate, access_token: string): Promise<ApiResponse<UsersResponse>>;
    deleteUser(id: string, access_token: string): Promise<ApiResponse<UsersResponse>>;
    createCategory(category: CategoryCreate, access_token: string): Promise<ApiResponse<CategoryResponse>>;
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
    createBrand(brand: BrandCreate, access_token: string): Promise<ApiResponse<BrandResponse>>;
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
    createProduct(product: ProductCreate, access_token: string): Promise<ApiResponse<ProductResponse>>;
    createByListProduct(product: any, access_token: string): Promise<ApiResponse<ProductResponse[]>>;
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
    searchProduct(page: number, limit: number, sortBy: 'date' | 'alpha' | 'price', sortOrder: 'asc' | 'desc', filters: {
        name?: string;
        categories?: string;
        brand?: string;
        min_price?: number;
        max_price?: number;
    }, access_token: string): Promise<ApiResponse<{
        data: ProductResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    updateProduct(id: string, product: ProductUpdate, access_token: string): Promise<ApiResponse<ProductResponse>>;
    deleteProduct(id: string, access_token: string): Promise<ApiResponse<ProductResponse>>;
    createOrder(order: OrderCreate, access_token: string): Promise<ApiResponse<OrderResponse>>;
    findAllOrder(page: number, limit: number, access_token: string): Promise<ApiResponse<{
        data: OrderResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdOrder(id: string, access_token: string): Promise<ApiResponse<OrderResponse>>;
    updateOrder(id: string, order: OrderUpdate, access_token: string): Promise<ApiResponse<OrderResponse>>;
    deleteOrder(id: string, access_token: string): Promise<ApiResponse<OrderResponse>>;
    createSpecialOffer(specialOffer: SpecialOfferCreate, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    findAllSpecialOffer(page: number, limit: number, access_token: string): Promise<ApiResponse<{
        data: SpecialOfferResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findByIdSpecialOffer(id: string, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    updateSpecialOffer(id: string, specialOffer: SpecialOfferUpdate, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    deleteSpecialOffer(id: string, access_token: string): Promise<ApiResponse<SpecialOfferResponse>>;
    createCustomization(customization: CustomizationCreate, access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    findCustomization(access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    findByIdCustomization(id: string, access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    updateCustomization(id: string, customization: CustomizationUpdate, access_token: string): Promise<ApiResponse<CustomizationResponse>>;
    deleteCustomization(id: string, access_token: string): Promise<ApiResponse<CustomizationResponse>>;
}
