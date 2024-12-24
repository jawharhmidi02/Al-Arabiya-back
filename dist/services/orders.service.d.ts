import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { OrderCreate, OrderResponse, OrderUpdate } from 'src/dto/orders.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { Order } from 'src/entities/orders.entity';
import { Product } from 'src/entities/products.entity';
export declare class OrderService {
    private orderRepository;
    private orderProductRepository;
    private productRepository;
    private usersRepository;
    private jwtService;
    constructor(orderRepository: Repository<Order>, orderProductRepository: Repository<OrderProduct>, productRepository: Repository<Product>, usersRepository: Repository<Users>, jwtService: JwtService);
    create(order: OrderCreate, access_token?: string): Promise<ApiResponse<OrderResponse>>;
    findAll(page?: number, limit?: number): Promise<ApiResponse<{
        data: OrderResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findById(id: string): Promise<ApiResponse<OrderResponse>>;
    update(id: string, order: OrderUpdate, access_token: string): Promise<ApiResponse<OrderResponse>>;
    delete(id: string, access_token: string): Promise<ApiResponse<OrderResponse>>;
}
