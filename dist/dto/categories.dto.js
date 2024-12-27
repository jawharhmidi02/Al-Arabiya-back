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
exports.CategoryResponse = exports.CategoryUpdate = exports.CategoryCreate = void 0;
const class_validator_1 = require("class-validator");
class CategoryCreate {
}
exports.CategoryCreate = CategoryCreate;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryCreate.prototype, "name", void 0);
class CategoryUpdate {
}
exports.CategoryUpdate = CategoryUpdate;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryUpdate.prototype, "name", void 0);
class CategoryResponse {
    constructor(category) {
        this.id = category.id;
        this.name = category.name;
        this.products = category.products;
    }
}
exports.CategoryResponse = CategoryResponse;
//# sourceMappingURL=categories.dto.js.map