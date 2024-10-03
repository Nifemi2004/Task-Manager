import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Task } from './task.entity';
import { BullModule } from '@nestjs/bull';
import { UserRepository } from '../user/user.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Task] }),
    BullModule.registerQueue({
      name: 'mail',
    }),
    UserModule
  ],
  providers: [TaskService, UserRepository],
  controllers: [TaskController],
})
export class TaskModule {}
