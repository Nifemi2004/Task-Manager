// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
  QueryOrder,
  wrap,
} from '@mikro-orm/mysql';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../user/user.entity';

export enum Status {
  Active = 'active',
  Completed = 'completed',
}

@Injectable()
export class TaskService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Task)
    private readonly repo: EntityRepository<Task>,
    @InjectQueue('mail') private readonly mailQueue: Queue,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {
    console.log('EntityManager:', this.em),
      console.log('TaskRepository:', this.repo);
  }

  async findAll(): Promise<Task[]> {
    return this.repo.findAll();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.repo.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async findByStatus(status: 'active' | 'completed'): Promise<Task[]> {
    return this.repo.find({ status });
  }

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const task = this.repo.create({
      ...createTaskDto,
      user, // Associate task with user
    });
    try {
      await this.em.persistAndFlush(task);
    } catch (error) {
      console.log(error);
    }

    if (task.dueDate) {
      await this.scheduleEmail(task);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    const wasCompleted = task.status === Status.Completed;
    this.repo.assign(task, updateTaskDto);
    await this.em.persistAndFlush(task);

    if (task.dueDate) {
      if (!wasCompleted && task.status === Status.Completed) {
        // Task was marked as completed, cancel the scheduled email
        await this.cancelScheduledEmail(id);
      } else {
        // (Re)schedule the email
        await this.scheduleEmail(task);
      }
    }

    return task;
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.em.removeAndFlush(task);
  }

  async findExpiredTasks(currentTime: Date): Promise<Task[]> {
    return this.repo.find({
      dueDate: { $lt: currentTime },
      isTimerExpired: false,
      status: 'active',
    });
  }

  async scheduleEmail(task: Task): Promise<void> {
    const delay = task.dueDate!.getTime() - Date.now();

    if (delay <= 0) {
      console.log('Due date has already passed');
      return;
    }

    await this.mailQueue.add(
      'send-timer-expired-email',
      { task },
      {
        delay,
        attempts: 3,
      },
    );
  }

  async cancelScheduledEmail(taskId: number): Promise<void> {
    const jobs = await this.mailQueue.getJobs(['delayed']);
    for (const job of jobs) {
      if (job.data.task.id === taskId) {
        await job.remove();
      }
    }
  }
}
