// src/tasks/tasks.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../user/auth/auth.guard';
import { User } from '../user/user.decorator';
import { IUserData } from '../user/user.interface';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private tasksService: TaskService) {
    console.log('TasksService:', this.tasksService);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @User('id') userId: number, // Extracting user ID
  ): Promise<Task> {
    console.log(createTaskDto, 'hello');
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  async findAll(@User('id') userId: number): Promise<Task[]> {
    return this.tasksService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number,
  ): Promise<Task> {
    return this.tasksService.findOne(id, userId);
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: 'active' | 'completed',
    @User('id') userId: number,
  ): Promise<Task[]> {
    return this.tasksService.findByStatus(status, userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @User('id') userId: number,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number,
  ): Promise<void> {
    return this.tasksService.remove(id, userId);
  }
}
