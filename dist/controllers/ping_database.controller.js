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
exports.PingController = void 0;
const common_1 = require("@nestjs/common");
const ping_database_service_1 = require("../services/ping_database.service");
let PingController = class PingController {
    constructor(pingService) {
        this.pingService = pingService;
    }
    checkHealth() {
        this.pingService.pingDatabase();
    }
};
exports.PingController = PingController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PingController.prototype, "checkHealth", null);
exports.PingController = PingController = __decorate([
    (0, common_1.Controller)('ping-database'),
    __metadata("design:paramtypes", [ping_database_service_1.PingService])
], PingController);
//# sourceMappingURL=ping_database.controller.js.map