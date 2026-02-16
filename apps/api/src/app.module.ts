import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { BookingModule } from './booking/booking.module';
import { LmsModule } from './lms/lms.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { GradesModule } from './grades/grades.module';
import { CertificatesModule } from './certificates/certificates.module';
import { HealthModule } from './health/health.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    ServicesModule,
    BookingModule,
    LmsModule,
    AssessmentsModule,
    GradesModule,
    CertificatesModule,
    AdminModule,
  ],
})
export class AppModule {}
