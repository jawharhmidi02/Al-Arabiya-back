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
exports.SpecialOfferResponse = exports.SpecialOfferUpdate = exports.SpecialOfferCreate = void 0;
const class_validator_1 = require("class-validator");
class SpecialOfferCreate {
}
exports.SpecialOfferCreate = SpecialOfferCreate;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SpecialOfferCreate.prototype, "href", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SpecialOfferCreate.prototype, "img", void 0);
class SpecialOfferUpdate {
}
exports.SpecialOfferUpdate = SpecialOfferUpdate;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SpecialOfferUpdate.prototype, "href", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SpecialOfferUpdate.prototype, "img", void 0);
class SpecialOfferResponse {
    constructor(specialOffer) {
        this.id = specialOffer.id;
        this.img = specialOffer.img;
        this.href = specialOffer.href;
    }
}
exports.SpecialOfferResponse = SpecialOfferResponse;
//# sourceMappingURL=specialOffers.dto.js.map