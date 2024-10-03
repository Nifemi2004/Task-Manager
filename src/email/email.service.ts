// src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { Task } from '../task/task.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    // Initialize transporter using environment variables
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false, // true for port 465, false for other ports
    //   auth: {
    //     user: this.configService.get<string>('EMAIL_USER'),
    //     pass: this.configService.get<string>('EMAIL_PASS'),
    //   },
    });
  }

  async sendTimerExpiredEmail(task: Task): Promise<void> {
    const recipient = 'sokooyanifemi@gmail.com';

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Task Manager" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: recipient,
      subject: `Task Timer Expired: ${task.description}`,
      text: `Hello,

The timer for your task "${task.description}" has expired.

Description: ${task.description}

Please take the necessary actions.

Best regards,
Task Management System`,
      // You can also use HTML
      html: `<p>Hello,</p>
<p>The timer for your task "<strong>${task.description}</strong>" has expired.</p>
<p><strong>Description:</strong> ${task.description}</p>
<p>Please take the necessary actions.</p>
<p>Best regards,<br/>Task Management System</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Timer expired email sent for Task ID ${task.id} to ${recipient}.`,
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to send email for Task ID ${task.id}: ${error.message}`,
      );
      throw error;
    }
  }
}
