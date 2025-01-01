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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomizationResponse = exports.CustomizationUpdate = exports.CustomizationCreate = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CategoryDTO {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CategoryDTO.prototype, "id", void 0);
class BrandDTO {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BrandDTO.prototype, "id", void 0);
class ProductDTO {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProductDTO.prototype, "id", void 0);
class CustomizationCreate {
}
exports.CustomizationCreate = CustomizationCreate;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CustomizationCreate.prototype, "deliveryPrice", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ProductDTO),
    __metadata("design:type", Array)
], CustomizationCreate.prototype, "featuredProducts", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CategoryDTO),
    __metadata("design:type", Array)
], CustomizationCreate.prototype, "categories", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BrandDTO),
    __metadata("design:type", Array)
], CustomizationCreate.prototype, "brands", void 0);
class CustomizationUpdate {
}
exports.CustomizationUpdate = CustomizationUpdate;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CustomizationUpdate.prototype, "deliveryPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ProductDTO),
    __metadata("design:type", Array)
], CustomizationUpdate.prototype, "featuredProducts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CategoryDTO),
    __metadata("design:type", Array)
], CustomizationUpdate.prototype, "categories", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BrandDTO),
    __metadata("design:type", Array)
], CustomizationUpdate.prototype, "brands", void 0);
class CustomizationResponse {
    constructor(customization) {
        this.id = customization.id;
        this.deliveryPrice = customization.deliveryPrice;
        this.featuredProducts = customization.featuredProducts;
        this.categories = customization.categories;
        this.brands = customization.brands;
    }
}
exports.CustomizationResponse = CustomizationResponse;
//# sourceMappingURL=customizations.dto.js.map