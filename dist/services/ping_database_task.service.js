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
exports.PingTaskService = void 0;
const common_1 = require("@nestjs/common");
const ping_database_service_1 = require("./ping_database.service");
const { API_URL } = process.env;
let PingTaskService = class PingTaskService {
    constructor(pingService) {
        this.pingService = pingService;
        this.logger = new common_1.Logger(ping_database_service_1.PingService.name);
    }
    onModuleInit() {
        this.startPingingDatabase();
    }
    async startPingingDatabase() {
        setInterval(async () => {
            try {
                const response = await fetch(`${API_URL}/ping-database`);
                if (response.ok) {
                    this.logger.log('Server ping successful');
                }
                else {
                    this.logger.warn('Server ping failed with status:', response.status);
                }
            }
            catch (error) {
                this.logger.error('Error pinging server:', error);
            }
        }, 300000);
    }
};
exports.PingTaskService = PingTaskService;
exports.PingTaskService = PingTaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ping_database_service_1.PingService])
], PingTaskService);
//# sourceMappingURL=ping_database_task.service.js.map