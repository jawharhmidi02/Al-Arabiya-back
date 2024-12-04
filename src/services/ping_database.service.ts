import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class PingService {
  private readonly logger = new Logger(PingService.name);

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async pingDatabase(): Promise<void> {
    try {
      const count = await this.usersRepository.count();
      this.logger.log('Database ping successful, Count: ' + count);
    } catch (error) {
      this.logger.error('Error pinging the database', error);
    }
  }
}
