import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Task } from './task.entity';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Task] }),
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
