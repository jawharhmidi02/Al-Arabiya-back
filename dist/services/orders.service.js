"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const orders_dto_1 = require("../dto/orders.dto");
const users_entity_1 = require("../entities/users.entity");
const orderProduct_entity_1 = require("../entities/orderProduct.entity");
const orders_entity_1 = require("../entities/orders.entity");
const products_entity_1 = require("../entities/products.entity");
let OrderService = class OrderService {
    constructor(orderRepository, orderProductRepository, productRepository, usersRepository, jwtService) {
        this.orderRepository = orderRepository;
        this.orderProductRepository = orderProductRepository;
        this.productRepository = productRepository;
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async create(order, access_token) {
        try {
            const orderItems = order.cart;
            const { id } = await this.orderRepository.save(order);
            const orderResponse = await this.orderRepository.findOne({
                where: { id },
                relations: ['order_Products'],
            });
            for (const id in orderItems) {
                const orderItem = new orderProduct_entity_1.OrderProduct();
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
                }
                else {
                    orderItem.price =
                        product.soldSinglePrice !== 0
                            ? product.soldSinglePrice
                            : product.normalSinglePrice;
                }
                const savedOrderItem = await this.orderProductRepository.save(orderItem);
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
                        statusCode: common_1.HttpStatus.FORBIDDEN,
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
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Order created successfully',
                data: new orders_dto_1.OrderResponse(data),
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message || 'Failed to create order', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(page = 1, limit = 10) {
        try {
            const [response, totalItems] = await this.orderRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
                relations: ['order_Products'],
            });
            const data = response.map((item) => new orders_dto_1.OrderResponse(item));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Orders retrieved successfully',
                data: {
                    data: data,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page,
                    totalItems,
                },
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Orders',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findById(id) {
        try {
            const response = await this.orderRepository.findOne({
                where: { id },
                relations: ['order_Products'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Order not found',
                    data: null,
                };
            const data = new orders_dto_1.OrderResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Order retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Order',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, order, access_token) {
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token);
            const account = await this.usersRepository.findOne({
                where: { id: payLoad.id },
            });
            if (!account ||
                account.nonce !== payLoad.nonce ||
                account.role !== 'admin') {
                return {
                    statusCode: common_1.HttpStatus.FORBIDDEN,
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
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Order not found',
                    data: null,
                };
            const data = new orders_dto_1.OrderResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Order updated successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Update Order',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(id, access_token) {
        try {
            const payLoad = await this.jwtService.verifyAsync(access_token);
            const account = await this.usersRepository.findOne({
                where: { id: payLoad.id },
            });
            if (!account ||
                account.nonce !== payLoad.nonce ||
                account.role !== 'admin') {
                return {
                    statusCode: common_1.HttpStatus.FORBIDDEN,
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
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Order not found',
                    data: null,
                };
            await this.orderRepository.delete(id);
            const data = new orders_dto_1.OrderResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Order deleted successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Delete Order',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(orders_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(orderProduct_entity_1.OrderProduct)),
    __param(2, (0, typeorm_1.InjectRepository)(products_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], OrderService);
//# sourceMappingURL=orders.service.js.map