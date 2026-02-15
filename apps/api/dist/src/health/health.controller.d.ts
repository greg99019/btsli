import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    root(): {
        message: string;
    };
    health(): {
        name: string;
        status: string;
        timestamp: string;
    };
}
