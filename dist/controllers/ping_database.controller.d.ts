import { PingService } from "src/services/ping_database.service";
export declare class PingController {
    private readonly pingService;
    constructor(pingService: PingService);
    checkHealth(): void;
}
