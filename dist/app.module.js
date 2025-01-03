"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const connect_module_1 = require("./connect.module");
const users_module_1 = require("./modules/users.module");
const categories_module_1 = require("./modules/categories.module");
const brands_module_1 = require("./modules/brands.module");
const products_module_1 = require("./modules/products.module");
const ping_database_module_1 = require("./modules/ping_database.module");
const orders_module_1 = require("./modules/orders.module");
const admins_module_1 = require("./modules/admins.module");
const specialOffers_module_1 = require("./modules/specialOffers.module");
const customizations_module_1 = require("./modules/customizations.module");
const cors_middleware_1 = require("./middleware/cors.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(cors_middleware_1.CorsMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            connect_module_1.ConnectModule,
            users_module_1.UserModule,
            admins_module_1.AdminModule,
            categories_module_1.CategoryModule,
            brands_module_1.BrandModule,
            products_module_1.ProductModule,
            ping_database_module_1.PingModule,
            orders_module_1.OrderModule,
            specialOffers_module_1.SpecialOfferModule,
            customizations_module_1.CustomizationModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map