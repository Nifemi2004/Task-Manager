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
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../user/auth/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private tasksService: TaskService) {
    console.log('TasksService:', this.tasksService);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    console.log(createTaskDto, 'hello');
    return this.tasksService.create(createTaskDto, id);
  }

  @Get()
  async findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Get('status/:status')
  findByStatus(
    @Param('status') status: 'active' | 'completed',
  ): Promise<Task[]> {
    return this.tasksService.findByStatus(status);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.remove(id);
  }
}
