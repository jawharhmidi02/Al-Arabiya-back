import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PingService } from 'src/services/ping_database.service';
import { PingTaskService } from 'src/services/ping_database_task.service';
import { PingController } from 'src/controllers/ping_database.controller';
import { Users } from 'src/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [PingService, PingTaskService],
  controllers: [PingController],
})
export class PingModule {}
