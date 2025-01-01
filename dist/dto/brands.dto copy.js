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
exports.BrandResponse = exports.BrandUpdate = exports.BrandCreate = void 0;
const class_validator_1 = require("class-validator");
class BrandCreate {
}
exports.BrandCreate = BrandCreate;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BrandCreate.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BrandCreate.prototype, "img", void 0);
class BrandUpdate {
}
exports.BrandUpdate = BrandUpdate;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BrandUpdate.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BrandUpdate.prototype, "img", void 0);
class BrandResponse {
    constructor(brand) {
        this.id = brand.id;
        this.name = brand.name;
        this.img = brand.img;
        this.productCount = brand.productCount;
        this.products = brand.products;
    }
}
exports.BrandResponse = BrandResponse;
//# sourceMappingURL=brands.dto%20copy.js.map