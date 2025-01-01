"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectModule = void 0;
const dotenv = require("dotenv");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const users_entity_1 = require("./entities/users.entity");
const categories_entity_1 = require("./entities/categories.entity");
const brands_entity_1 = require("./entities/brands.entity");
const products_entity_1 = require("./entities/products.entity");
const orders_entity_1 = require("./entities/orders.entity");
const orderProduct_entity_1 = require("./entities/orderProduct.entity");
const specialOffers_entity_1 = require("./entities/specialOffers.entity");
dotenv.config();
const { SUPABASE_HOST, SUPABASE_PORT, SUPABASE_USERNAME, SUPABASE_PASSWORD, SUPABASE_DATABASE, SUPABASE_DATABASE_URL, } = process.env;
let ConnectModule = class ConnectModule {
};
exports.ConnectModule = ConnectModule;
exports.ConnectModule = ConnectModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: SUPABASE_HOST,
                port: parseInt(SUPABASE_PORT, 10),
                username: SUPABASE_USERNAME,
                password: SUPABASE_PASSWORD,
                database: SUPABASE_DATABASE,
                url: SUPABASE_DATABASE_URL,
                entities: [
                    users_entity_1.Users,
                    categories_entity_1.Category,
                    brands_entity_1.Brand,
                    products_entity_1.Product,
                    orders_entity_1.Order,
                    orderProduct_entity_1.OrderProduct,
                    specialOffers_entity_1.SpecialOffer,
                ],
                synchronize: Boolean(process.env.DEVELOPMENT) || false,
            }),
        ],
    })
], ConnectModule);
//# sourceMappingURL=connect.module.js.map