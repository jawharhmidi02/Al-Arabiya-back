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
exports.CustomizationController = void 0;
const common_1 = require("@nestjs/common");
const customizations_dto_1 = require("../dto/customizations.dto");
const customizations_service_1 = require("../services/customizations.service");
let CustomizationController = class CustomizationController {
    constructor(customizationService) {
        this.customizationService = customizationService;
    }
    async create(customizationDto, access_token) {
        return await this.customizationService.create(customizationDto, access_token);
    }
    async find() {
        return await this.customizationService.find();
    }
    async findById(id) {
        return await this.customizationService.findById(id);
    }
    async update(id, customization, access_token) {
        return await this.customizationService.update(id, customization, access_token);
    }
    async delete(id, access_token) {
        return await this.customizationService.delete(id, access_token);
    }
};
exports.CustomizationController = CustomizationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customizations_dto_1.CustomizationCreate, String]),
    __metadata("design:returntype", Promise)
], CustomizationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomizationController.prototype, "find", null);
__decorate([
    (0, common_1.Get)('/byid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomizationController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customizations_dto_1.CustomizationUpdate, String]),
    __metadata("design:returntype", Promise)
], CustomizationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomizationController.prototype, "delete", null);
exports.CustomizationController = CustomizationController = __decorate([
    (0, common_1.Controller)('customization'),
    __metadata("design:paramtypes", [customizations_service_1.CustomizationService])
], CustomizationController);
//# sourceMappingURL=customizations.controller.js.map