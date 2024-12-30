import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { OrderCreate, OrderResponse, OrderUpdate } from 'src/dto/orders.dto';
import { OrderService } from 'src/services/orders.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @Body() orderDto: OrderCreate,
    @Headers('access_token') access_token?: string,
  ): Promise<ApiResponse<OrderResponse>> {
    return await this.orderService.create(orderDto, access_token);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<
    ApiResponse<{
      data: OrderResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    return this.orderService.findAll(page, limit);
  }

  @Get('/byid/:id')
  findById(@Param('id') id: string): Promise<ApiResponse<OrderResponse>> {
    return this.orderService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() order: OrderUpdate,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    return this.orderService.update(id, order, access_token);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    return this.orderService.delete(id, access_token);
  }
}
