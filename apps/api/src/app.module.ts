import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { BookingModule } from './booking/booking.module';
import { LmsModule } from './lms/lms.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { GradesModule } from './grades/grades.module';
import { CertificatesModule } from './certificates/certificates.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ServicesModule,
    BookingModule,
    LmsModule,
    AssessmentsModule,
    GradesModule,
    CertificatesModule,
  ],
})
export class AppModule {}
