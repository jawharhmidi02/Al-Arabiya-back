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
exports.SpecialOfferController = void 0;
const common_1 = require("@nestjs/common");
const specialOffers_dto_1 = require("../dto/specialOffers.dto");
const specialOffers_service_1 = require("../services/specialOffers.service");
let SpecialOfferController = class SpecialOfferController {
    constructor(specialOfferService) {
        this.specialOfferService = specialOfferService;
    }
    async create(specialOfferDto, access_token) {
        return await this.specialOfferService.create(specialOfferDto, access_token);
    }
    findAll(page, limit) {
        return this.specialOfferService.findAll(page, limit);
    }
    findById(id) {
        return this.specialOfferService.findById(id);
    }
    update(id, specialOffer, access_token) {
        return this.specialOfferService.update(id, specialOffer, access_token);
    }
    delete(id, access_token) {
        return this.specialOfferService.delete(id, access_token);
    }
};
exports.SpecialOfferController = SpecialOfferController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [specialOffers_dto_1.SpecialOfferCreate, String]),
    __metadata("design:returntype", Promise)
], SpecialOfferController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SpecialOfferController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/byid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpecialOfferController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, specialOffers_dto_1.SpecialOfferUpdate, String]),
    __metadata("design:returntype", Promise)
], SpecialOfferController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SpecialOfferController.prototype, "delete", null);
exports.SpecialOfferController = SpecialOfferController = __decorate([
    (0, common_1.Controller)('specialOffer'),
    __metadata("design:paramtypes", [specialOffers_service_1.SpecialOfferService])
], SpecialOfferController);
//# sourceMappingURL=specialOffers.controller.js.map