"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomizationModule = void 0;
const customizations_controller_1 = require("../controllers/customizations.controller");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_constant_1 = require("../constants/jwt.constant");
const customizations_entity_1 = require("../entities/customizations.entity");
const users_entity_1 = require("../entities/users.entity");
const customizations_service_1 = require("../services/customizations.service");
let CustomizationModule = class CustomizationModule {
};
exports.CustomizationModule = CustomizationModule;
exports.CustomizationModule = CustomizationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([customizations_entity_1.Customization, users_entity_1.Users]),
            jwt_1.JwtModule.register({ secret: jwt_constant_1.jwtConstants.secret, global: true }),
        ],
        providers: [customizations_service_1.CustomizationService],
        controllers: [customizations_controller_1.CustomizationController],
    })
], CustomizationModule);
//# sourceMappingURL=customizations.module.js.map