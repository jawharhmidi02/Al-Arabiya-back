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
exports.ProductService = void 0;
const jwt_1 = require("@nestjs/jwt");
const products_entity_1 = require("../entities/products.entity");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const products_dto_1 = require("../dto/products.dto");
const users_entity_1 = require("../entities/users.entity");
let ProductService = class ProductService {
    constructor(productRepository, jwtService, usersRepository) {
        this.productRepository = productRepository;
        this.jwtService = jwtService;
        this.usersRepository = usersRepository;
    }
    async create(product, access_token) {
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
            const savedProduct = await this.productRepository.save(product);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Product created successfully',
                data: new products_dto_1.ProductResponse(savedProduct),
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message || 'Failed to create product', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(page = 1, limit = 10) {
        try {
            const [response, totalItems] = await this.productRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
                relations: ['category', 'brand'],
            });
            const data = response.map((item) => new products_dto_1.ProductResponse(item));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Products retrieved successfully',
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
                message: error.message || 'Failed to retrieve Products',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findById(id) {
        try {
            const response = await this.productRepository.findOne({
                where: { id },
                relations: ['category', 'brand'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                    data: null,
                };
            const data = new products_dto_1.ProductResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Product retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Product',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByName(name) {
        try {
            const response = await this.productRepository.find({
                where: { name: (0, typeorm_2.Like)(`%${name}%`) },
                relations: ['category', 'brand'],
            });
            const data = response.map((item) => new products_dto_1.ProductResponse(item));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Product retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Products',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async search(page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc', filters) {
        try {
            const queryBuilder = this.productRepository.createQueryBuilder('product');
            queryBuilder.leftJoinAndSelect('product.category', 'category');
            queryBuilder.leftJoinAndSelect('product.brand', 'brand');
            queryBuilder.skip((page - 1) * limit).take(limit);
            if (filters.name) {
                queryBuilder.andWhere('product.name LIKE :name', {
                    name: `%${filters.name}%`,
                });
            }
            const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
            if (sortBy === 'date') {
                queryBuilder.orderBy('product.created_At', order);
            }
            else if (sortBy === 'alpha') {
                queryBuilder.orderBy('product.name', order);
            }
            else if (sortBy === 'price') {
                queryBuilder.orderBy('product.price', order);
            }
            const [products, totalItems] = await queryBuilder.getManyAndCount();
            const data = products.map((product) => new products_dto_1.ProductResponse(product));
            const totalPages = Math.ceil(totalItems / limit);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Products retrieved successfully',
                data: {
                    data,
                    totalPages,
                    currentPage: page,
                    totalItems,
                },
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Products',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, product, access_token) {
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
            await this.productRepository.update(id, product);
            const response = await this.productRepository.findOne({
                where: { id },
                relations: ['category', 'brand'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                    data: null,
                };
            const data = new products_dto_1.ProductResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Product updated successfully',
                data,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Update Product',
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
            const response = await this.productRepository.findOne({
                where: { id },
                relations: ['category', 'brand'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                    data: null,
                };
            await this.productRepository.delete(id);
            const data = new products_dto_1.ProductResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Product deleted successfully',
                data,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Delete Product',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(products_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=products.service.js.map