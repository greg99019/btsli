import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getStatus() {
    return {
      name: 'BTSLI LMS API',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  getRootMessage() {
    return {
      message: 'BTSLI LMS API is running',
    };
  }
}
