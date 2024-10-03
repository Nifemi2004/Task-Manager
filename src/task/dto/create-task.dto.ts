// src/tasks/dto/create-task.dto.ts
import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsInt, Min } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  readonly description!: string;

  @IsNotEmpty()
  @IsString()
  status!: 'active' | 'completed';

  @IsOptional()
  readonly dueDate?: Date;

  // @IsOptional()
  // @IsBoolean()
  // reminderEnabled?: boolean;

  // @IsOptional()
  // @IsInt()
  // @Min(1)
  // reminderTimeGapMinutes?: number;
}
