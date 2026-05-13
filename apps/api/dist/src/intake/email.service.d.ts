export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    private initTransporter;
    private send;
    sendConfirmation(lead: any): Promise<void>;
    sendLeadNotification(lead: any): Promise<void>;
    sendBriefingNotification(lead: any, briefing: any): Promise<void>;
}
