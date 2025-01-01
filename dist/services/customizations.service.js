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
exports.CustomizationService = void 0;
const jwt_1 = require("@nestjs/jwt");
const customizations_entity_1 = require("../entities/customizations.entity");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const customizations_dto_1 = require("../dto/customizations.dto");
const users_entity_1 = require("../entities/users.entity");
let CustomizationService = class CustomizationService {
    constructor(customizationRepository, jwtService, usersRepository) {
        this.customizationRepository = customizationRepository;
        this.jwtService = jwtService;
        this.usersRepository = usersRepository;
    }
    async create(customization, access_token) {
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
            const count = await this.customizationRepository.count();
            if (count > 0) {
                throw new common_1.HttpException('Customization already exists', common_1.HttpStatus.BAD_REQUEST);
            }
            const savedCustomization = await this.customizationRepository.save(customization);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Customization created successfully',
                data: new customizations_dto_1.CustomizationResponse(savedCustomization),
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message || 'Failed to create customization', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async find() {
        try {
            const response = await this.customizationRepository.find({
                relations: [
                    'featuredProducts',
                    'featuredProducts.category',
                    'featuredProducts.brand',
                    'brands',
                    'categories',
                ],
            });
            if (response.length === 0)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Customization not found',
                    data: null,
                };
            const data = new customizations_dto_1.CustomizationResponse(response[0]);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Customization retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Customization',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findById(id) {
        try {
            const response = await this.customizationRepository.findOne({
                where: { id },
                relations: [
                    'featuredProducts',
                    'featuredProducts.category',
                    'featuredProducts.brands',
                    'brands',
                    'categories',
                ],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Customization not found',
                    data: null,
                };
            const data = new customizations_dto_1.CustomizationResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Customization retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve Customization',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, customization, access_token) {
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
            await this.customizationRepository.update({ id }, customization);
            const response = await this.customizationRepository.findOne({
                where: { id },
                relations: [
                    'featuredProducts',
                    'featuredProducts.category',
                    'featuredProducts.brands',
                    'brands',
                    'categories',
                ],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Customization not found',
                    data: null,
                };
            const data = new customizations_dto_1.CustomizationResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Customization updated successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Update Customization',
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
            const response = await this.customizationRepository.findOne({
                where: { id },
                relations: [
                    'featuredProducts',
                    'featuredProducts.category',
                    'featuredProducts.brands',
                    'brands',
                    'categories',
                ],
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Customization not found',
                    data: null,
                };
            await this.customizationRepository.delete(id);
            const data = new customizations_dto_1.CustomizationResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Customization deleted successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Delete Customization',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CustomizationService = CustomizationService;
exports.CustomizationService = CustomizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customizations_entity_1.Customization)),
    __param(2, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.Repository])
], CustomizationService);
//# sourceMappingURL=customizations.service.js.map