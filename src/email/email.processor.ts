// src/email/email.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from './email.service';
import { Task } from '../task/task.entity';

@Processor('mail')
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('send-timer-expired-email')
  async handleSendTimerExpiredEmail(job: Job<{ task: Task }>) {
    const { task } = job.data;
    await this.emailService.sendTimerExpiredEmail(task);
  }
}
