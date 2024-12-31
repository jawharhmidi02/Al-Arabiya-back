"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admins_service_1 = require("../services/admins.service");
const admins_controller_1 = require("../controllers/admins.controller");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../entities/users.entity");
const jwt_1 = require("@nestjs/jwt");
const jwt_constant_1 = require("../constants/jwt.constant");
const brands_entity_1 = require("../entities/brands.entity");
const categories_entity_1 = require("../entities/categories.entity");
const orders_entity_1 = require("../entities/orders.entity");
const products_entity_1 = require("../entities/products.entity");
const specialOffers_entity_1 = require("../entities/specialOffers.entity");
const orderProduct_entity_1 = require("../entities/orderProduct.entity");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                users_entity_1.Users,
                brands_entity_1.Brand,
                categories_entity_1.Category,
                orders_entity_1.Order,
                orderProduct_entity_1.OrderProduct,
                products_entity_1.Product,
                specialOffers_entity_1.SpecialOffer,
            ]),
            jwt_1.JwtModule.register({
                global: true,
                secret: jwt_constant_1.jwtConstants.secret,
                signOptions: { expiresIn: '7d' },
            }),
        ],
        controllers: [admins_controller_1.AdminController],
        providers: [admins_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admins.module.js.map