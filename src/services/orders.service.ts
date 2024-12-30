import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { OrderCreate, OrderResponse, OrderUpdate } from 'src/dto/orders.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Users } from 'src/entities/users.entity';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { Order } from 'src/entities/orders.entity';
import { Product } from 'src/entities/products.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async create(
    order: OrderCreate,
    access_token?: string,
  ): Promise<ApiResponse<OrderResponse>> {
    try {
      const orderItems: Record<string, number> = order.cart;
      const { id } = await this.orderRepository.save(order);

      const orderResponse = await this.orderRepository.findOne({
        where: { id },
        relations: ['order_Products'],
      });

      for (const id in orderItems) {
        const orderItem = new OrderProduct();

        const product = await this.productRepository.findOne({
          where: { id },
        });

        orderItem.order = orderResponse;
        orderItem.quantity = orderItems[id];
        orderItem.product = product;

        if (orderItems[id] > 5) {
          orderItem.price =
            product.soldMultiPrice !== 0
              ? product.soldMultiPrice
              : product.normalMultiPrice;
        } else {
          orderItem.price =
            product.soldSinglePrice !== 0
              ? product.soldSinglePrice
              : product.normalSinglePrice;
        }

        const savedOrderItem =
          await this.orderProductRepository.save(orderItem);

        orderResponse.order_Products.push(savedOrderItem);
      }

      if (access_token) {
        const payLoad = await this.jwtService.verifyAsync(access_token);

        const account = await this.usersRepository.findOne({
          where: { id: payLoad.id },
          relations: ['orders'],
        });
        console.log('account');
        console.log(account);

        if (!account || account.nonce !== payLoad.nonce) {
          return {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'Unauthorized access',
            data: null,
          };
        }
        account.orders.push(orderResponse);
        await this.usersRepository.save(account);
      }

      const { id: orderId } = await this.orderRepository.save(orderResponse);
      const data = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['order_Products'],
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Order created successfully',
        data: new OrderResponse(data),
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Failed to create order',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<
    ApiResponse<{
      data: OrderResponse[];
      totalPages: number;
      currentPage: number;
      totalItems: number;
    }>
  > {
    try {
      const [response, totalItems] = await this.orderRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['order_Products'],
      });

      const data = response.map((item) => new OrderResponse(item));

      return {
        statusCode: HttpStatus.OK,
        message: 'Orders retrieved successfully',
        data: {
          data: data,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
          totalItems,
        },
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Orders',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<ApiResponse<OrderResponse>> {
    try {
      const response = await this.orderRepository.findOne({
        where: { id },
        relations: ['order_Products'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Order not found',
          data: null,
        };

      const data = new OrderResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Order retrieved successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to retrieve Order',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    order: OrderUpdate,
    access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token);
      const account = await this.usersRepository.findOne({
        where: { id: payLoad.id },
      });

      if (
        !account ||
        account.nonce !== payLoad.nonce ||
        account.role !== 'admin'
      ) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Unauthorized access',
          data: null,
        };
      }

      await this.orderRepository.update(id, order);

      const response = await this.orderRepository.findOne({
        where: { id },
        relations: ['order_Products'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Order not found',
          data: null,
        };

      const data = new OrderResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Order updated successfully',
        data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Update Order',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(
    id: string,
    access_token: string,
  ): Promise<ApiResponse<OrderResponse>> {
    try {
      const payLoad = await this.jwtService.verifyAsync(access_token);
      const account = await this.usersRepository.findOne({
        where: { id: payLoad.id },
      });

      if (
        !account ||
        account.nonce !== payLoad.nonce ||
        account.role !== 'admin'
      ) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Unauthorized access',
          data: null,
        };
      }

      const response = await this.orderRepository.findOne({
        where: { id },
        relations: ['order_Products'],
      });

      if (!response)
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Order not found',
          data: null,
        };

      await this.orderRepository.delete(id);

      const data = new OrderResponse(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Order deleted successfully',
        data,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Failed to Delete Order',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
