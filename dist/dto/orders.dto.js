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
exports.OrderResponse = exports.OrderUpdate = exports.OrderCreate = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class OrderProductDTO {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OrderProductDTO.prototype, "id", void 0);
class OrderCreate {
}
exports.OrderCreate = OrderCreate;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderCreate.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderCreate.prototype, "client_Name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderCreate.prototype, "client_Phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderCreate.prototype, "client_Email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderCreate.prototype, "client_Address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderCreate.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.Validate)((obj) => {
        if (typeof obj !== 'object' || Array.isArray(obj))
            return false;
        return Object.values(obj).every((value) => typeof value === 'number');
    }),
    __metadata("design:type", Object)
], OrderCreate.prototype, "items", void 0);
class OrderUpdate {
}
exports.OrderUpdate = OrderUpdate;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderUpdate.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderUpdate.prototype, "client_Name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderUpdate.prototype, "client_Phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderUpdate.prototype, "client_Email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderUpdate.prototype, "client_Address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderUpdate.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => OrderProductDTO),
    __metadata("design:type", Array)
], OrderUpdate.prototype, "order_Products", void 0);
class OrderResponse {
    constructor(order) {
        this.id = order.id;
        this.state = order.state;
        this.client_Name = order.client_Name;
        this.client_Phone = order.client_Phone;
        this.client_Email = order.client_Email;
        this.client_Address = order.client_Address;
        this.type = order.type;
        this.order_Products = order.order_Products;
    }
}
exports.OrderResponse = OrderResponse;
//# sourceMappingURL=orders.dto.js.map