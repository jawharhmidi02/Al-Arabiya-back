import { Repository } from 'typeorm';
import { Users } from 'src/entities/users.entity';
export declare class PingService {
    private readonly usersRepository;
    private readonly logger;
    constructor(usersRepository: Repository<Users>);
    pingDatabase(): Promise<void>;
}
