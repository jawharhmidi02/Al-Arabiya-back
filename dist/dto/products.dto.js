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
exports.ProductResponse = exports.ProductUpdate = exports.ProductCreate = void 0;
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
class ProductCreate {
}
exports.ProductCreate = ProductCreate;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductCreate.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ each: true }),
    __metadata("design:type", Array)
], ProductCreate.prototype, "img", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductCreate.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductCreate.prototype, "onSold", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductCreate.prototype, "soldPercentage", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductCreate.prototype, "normalSinglePrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductCreate.prototype, "soldSinglePrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductCreate.prototype, "normalMultiPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductCreate.prototype, "soldMultiPrice", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductCreate.prototype, "in_Stock", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CategoryDTO),
    __metadata("design:type", CategoryDTO)
], ProductCreate.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BrandDTO),
    __metadata("design:type", BrandDTO)
], ProductCreate.prototype, "brand", void 0);
class ProductUpdate {
}
exports.ProductUpdate = ProductUpdate;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductUpdate.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ each: true }),
    __metadata("design:type", Array)
], ProductUpdate.prototype, "img", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductUpdate.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductUpdate.prototype, "onSold", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductUpdate.prototype, "soldPercentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductUpdate.prototype, "normalSinglePrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductUpdate.prototype, "soldSinglePrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductUpdate.prototype, "normalMultiPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductUpdate.prototype, "soldMultiPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductUpdate.prototype, "in_Stock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CategoryDTO),
    __metadata("design:type", CategoryDTO)
], ProductUpdate.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BrandDTO),
    __metadata("design:type", BrandDTO)
], ProductUpdate.prototype, "brand", void 0);
class ProductResponse {
    constructor(product) {
        this.id = product.id;
        this.name = product.name;
        this.img = product.img;
        this.description = product.description;
        this.onSold = product.onSold;
        this.soldPercentage = product.soldPercentage;
        this.created_At = product.created_At;
        this.normalSinglePrice = product.normalSinglePrice;
        this.soldSinglePrice = product.soldSinglePrice;
        this.normalMultiPrice = product.normalMultiPrice;
        this.soldMultiPrice = product.soldMultiPrice;
        this.in_Stock = product.in_Stock;
        this.category = product.category;
        this.brand = product.brand;
        this.orderProducts = product.orderProducts;
    }
}
exports.ProductResponse = ProductResponse;
//# sourceMappingURL=products.dto.js.map