import { CertificatesService } from './certificates.service';
import type { Response } from 'express';
export declare class CertificatesController {
    private certs;
    constructor(certs: CertificatesService);
    myPdf(req: any, courseId: string, res: Response): Promise<void>;
}
