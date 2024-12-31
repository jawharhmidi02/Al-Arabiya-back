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
exports.SpecialOfferService = void 0;
const jwt_1 = require("@nestjs/jwt");
const specialOffers_entity_1 = require("../entities/specialOffers.entity");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const specialOffers_dto_1 = require("../dto/specialOffers.dto");
const users_entity_1 = require("../entities/users.entity");
let SpecialOfferService = class SpecialOfferService {
    constructor(specialOfferRepository, jwtService, usersRepository) {
        this.specialOfferRepository = specialOfferRepository;
        this.jwtService = jwtService;
        this.usersRepository = usersRepository;
    }
    async create(specialOffer, access_token) {
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
            const savedSpecialOffer = await this.specialOfferRepository.save(specialOffer);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'SpecialOffer created successfully',
                data: new specialOffers_dto_1.SpecialOfferResponse(savedSpecialOffer),
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error.message || 'Failed to create SpecialOffer', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(page = 1, limit = 10) {
        try {
            const [response, totalItems] = await this.specialOfferRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
            });
            const data = response.map((item) => new specialOffers_dto_1.SpecialOfferResponse(item));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'SpecialOffers retrieved successfully',
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
                message: error.message || 'Failed to retrieve SpecialOffers',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findById(id) {
        try {
            const response = await this.specialOfferRepository.findOne({
                where: { id },
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'SpecialOffer not found',
                    data: null,
                };
            const data = new specialOffers_dto_1.SpecialOfferResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'SpecialOffer retrieved successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to retrieve SpecialOffer',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, specialOffer, access_token) {
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
            await this.specialOfferRepository.update({ id }, specialOffer);
            const response = await this.specialOfferRepository.findOne({
                where: { id },
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'SpecialOffer not found',
                    data: null,
                };
            const data = new specialOffers_dto_1.SpecialOfferResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'SpecialOffer updated successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Update SpecialOffer',
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
            const response = await this.specialOfferRepository.findOne({
                where: { id },
            });
            if (!response)
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'SpecialOffer not found',
                    data: null,
                };
            await this.specialOfferRepository.delete(id);
            const data = new specialOffers_dto_1.SpecialOfferResponse(response);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'SpecialOffer deleted successfully',
                data,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to Delete SpecialOffer',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.SpecialOfferService = SpecialOfferService;
exports.SpecialOfferService = SpecialOfferService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(specialOffers_entity_1.SpecialOffer)),
    __param(2, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.Repository])
], SpecialOfferService);
//# sourceMappingURL=specialOffers.service.js.map