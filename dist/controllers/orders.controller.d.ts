import { ApiResponse } from 'src/common/interfaces/response.interface';
import { OrderCreate, OrderResponse, OrderUpdate } from 'src/dto/orders.dto';
import { OrderService } from 'src/services/orders.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(orderDto: OrderCreate, access_token?: string): Promise<ApiResponse<OrderResponse>>;
    findAll(page: number, limit: number): Promise<ApiResponse<{
        data: OrderResponse[];
        totalPages: number;
        currentPage: number;
        totalItems: number;
    }>>;
    findById(id: string): Promise<ApiResponse<OrderResponse>>;
    update(id: string, order: OrderUpdate, access_token: string): Promise<ApiResponse<OrderResponse>>;
    delete(id: string, access_token: string): Promise<ApiResponse<OrderResponse>>;
}
