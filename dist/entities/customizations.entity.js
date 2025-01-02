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
exports.Customization = void 0;
const typeorm_1 = require("typeorm");
const brands_entity_1 = require("./brands.entity");
const categories_entity_1 = require("./categories.entity");
const products_entity_1 = require("./products.entity");
let Customization = class Customization {
};
exports.Customization = Customization;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Customization.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Customization.prototype, "deliveryPrice", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => products_entity_1.Product, (product) => product.customization),
    __metadata("design:type", Array)
], Customization.prototype, "featuredProducts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => categories_entity_1.Category, (category) => category.customization),
    __metadata("design:type", Array)
], Customization.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => brands_entity_1.Brand, (brand) => brand.customization),
    __metadata("design:type", Array)
], Customization.prototype, "brands", void 0);
exports.Customization = Customization = __decorate([
    (0, typeorm_1.Entity)()
], Customization);
//# sourceMappingURL=customizations.entity.js.map