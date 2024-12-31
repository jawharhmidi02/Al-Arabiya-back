"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialOfferModule = void 0;
const specialOffers_controller_1 = require("../controllers/specialOffers.controller");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_constant_1 = require("../constants/jwt.constant");
const specialOffers_entity_1 = require("../entities/specialOffers.entity");
const users_entity_1 = require("../entities/users.entity");
const specialOffers_service_1 = require("../services/specialOffers.service");
let SpecialOfferModule = class SpecialOfferModule {
};
exports.SpecialOfferModule = SpecialOfferModule;
exports.SpecialOfferModule = SpecialOfferModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([specialOffers_entity_1.SpecialOffer, users_entity_1.Users]),
            jwt_1.JwtModule.register({ secret: jwt_constant_1.jwtConstants.secret, global: true }),
        ],
        providers: [specialOffers_service_1.SpecialOfferService],
        controllers: [specialOffers_controller_1.SpecialOfferController],
    })
], SpecialOfferModule);
//# sourceMappingURL=specialOffers.module.js.map