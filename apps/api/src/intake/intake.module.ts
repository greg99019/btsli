import { Module } from '@nestjs/common';
import { IntakeController } from './intake.controller';
import { IntakeService } from './intake.service';
import { EmailService } from './email.service';

@Module({
  controllers: [IntakeController],
  providers: [IntakeService, EmailService],
})
export class IntakeModule {}
