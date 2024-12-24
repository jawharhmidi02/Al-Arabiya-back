import { OnModuleInit } from '@nestjs/common';
import { PingService } from 'src/services/ping_database.service';
export declare class PingTaskService implements OnModuleInit {
    private readonly pingService;
    private readonly logger;
    constructor(pingService: PingService);
    onModuleInit(): void;
    startPingingDatabase(): Promise<void>;
}
