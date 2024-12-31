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
exports.BrandService = void 0;
const jwt_1 = require("@nestjs/jwt");
const brands_entity_1 = require("../entities/brands.entity");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const brands_dto_1 = require("../dto/brands.dto");
const users_entity_1 = require("../entities/users.entity");
let BrandService = class BrandService {
    constructor(brandRepository, jwtService, usersRepository) {
        this.brandRepository = brandRepository;
        this.jwtService = jwtService;
        this.usersRepository = usersRepository;
    }
    async create(category, access_token) {
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
            const savedBrand = await this.brandRepository.save(category);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Brand created successfully',
                data: new brands_dto_1.BrandResponse(savedBrand),
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message || 'Failed to create category', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(page = 1, limit = 10) {
        try {
            const [response, totalItems] = await this.brandRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
                relations: ['products', 'products.category'],
            });
            const data = [];
            for (let i = 0; i < response.length; i++) {
                const category = new brands_dto_1.BrandResponse(response[i]);
                data.push(category);
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Brands retrieved successfully',
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
                message: error.message || 'Failed to retrieve Brands',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findById(id) {
        try {
            const response = await this.brandRepository.findOne({
                where: { id },
                relations: ['products', 'products.category'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Brand not found',
                    data: null,
                };
            const data = new brands_dto_1.BrandResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Brand retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Brand',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByName(name) {
        try {
            const response = await this.brandRepository.find({
                where: { name: (0, typeorm_2.Like)(`%${name}%`) },
                relations: ['products', 'products.category'],
            });
            const data = [];
            for (let i = 0; i < response.length; i++) {
                const category = new brands_dto_1.BrandResponse(response[i]);
                data.push(category);
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Brand retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Brands',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, category, access_token) {
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
            await this.brandRepository.update({ id }, category);
            const response = await this.brandRepository.findOne({
                where: { id },
                relations: ['products', 'products.category'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Brand not found',
                    data: null,
                };
            const data = new brands_dto_1.BrandResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Brand updated successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Update Brand',
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
            const response = await this.brandRepository.findOne({
                where: { id },
                relations: ['products', 'products.category'],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Brand not found',
                    data: null,
                };
            await this.brandRepository.delete(id);
            const data = new brands_dto_1.BrandResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Brand deleted successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Delete Brand',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.BrandService = BrandService;
exports.BrandService = BrandService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(brands_entity_1.Brand)),
    __param(2, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.Repository])
], BrandService);
//# sourceMappingURL=brands.service%20copy.js.map