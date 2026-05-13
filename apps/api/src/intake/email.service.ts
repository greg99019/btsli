import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: any = null;

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    const host = process.env.SMTP_HOST;
    if (!host) {
      this.logger.warn('SMTP_HOST not set — emails will be logged to console only');
      return;
    }
    try {
      // nodemailer is an optional dependency; install with: npm install nodemailer @types/nodemailer
      const nodemailer = await import('nodemailer');
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT ?? '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.logger.log('Email transport ready');
    } catch {
      this.logger.warn('nodemailer not installed — emails will be logged to console only. Run: npm install nodemailer');
    }
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.transporter) {
      this.logger.log(`\n[EMAIL → ${to}]\nSubject: ${subject}\n${html.replace(/<[^>]+>/g, '')}\n`);
      return;
    }
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM ?? 'noreply@btsli.com',
      to,
      subject,
      html,
    });
  }

  async sendConfirmation(lead: any) {
    const webUrl = process.env.WEB_URL ?? 'https://btsli.com';
    const subject = `Your BTSLI™ Systems Fit Assessment — Next Steps`;
    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #0e7490); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 26px;">BTSLI™</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Beyond The Surface Leadership Institute™, LLC</p>
        </div>
        <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e3a8a; margin-top: 0;">Thank you, ${lead.contactName}.</h2>
          <p>We've received your <strong>Systems Fit Assessment request</strong> for <strong>${lead.orgName}</strong>.</p>
          <p>Based on your initial responses, we've identified <strong>${lead.suggestedPath}</strong> as a likely starting point for your organization.</p>
          <p style="margin-top: 24px;">To ensure our consultation is as focused and useful as possible, please complete the <strong>Systems Assessment</strong> — it takes about 10 minutes and allows us to go deeper on your specific situation before we speak.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${webUrl}/intake/assessment?leadId=${lead.id}"
              style="background: linear-gradient(135deg, #2563eb, #0891b2); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Complete the Systems Assessment →
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px;">A consultant will reach out within 1–2 business days to confirm your preferred consultation time. You indicated: <em>${lead.preferredTime ?? 'Flexible'}</em>.</p>
        </div>
        <div style="padding: 16px; text-align: center; color: #94a3b8; font-size: 12px; background: #1e293b;">
          <p style="margin: 0; color: #94a3b8;">Beyond The Surface Leadership Institute™, LLC · WOSB &amp; EDWOSB Certified</p>
          <p style="margin: 4px 0 0; color: #64748b;">System-centered clarity. Sustainable performance.</p>
        </div>
      </div>`;
    await this.send(lead.contactEmail, subject, html);
  }

  async sendLeadNotification(lead: any) {
    const consultantEmail = process.env.CONSULTANT_EMAIL;
    if (!consultantEmail) return;

    const subject = `New Lead: ${lead.orgName} — ${lead.suggestedPath} (Score: ${lead.leadScore}/100)`;
    const urgencyColor = lead.urgencyLevel === 'CRITICAL' ? '#dc2626' : lead.urgencyLevel === 'HIGH' ? '#ea580c' : '#2563eb';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #1e3a8a;">New Lead Captured</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; width: 180px;">Organization</td><td style="padding: 8px;">${lead.orgName}</td></tr>
          <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Contact</td><td style="padding: 8px;">${lead.contactName} (${lead.role}) — <a href="mailto:${lead.contactEmail}">${lead.contactEmail}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Main Challenge</td><td style="padding: 8px;">${lead.mainChallenge}</td></tr>
          <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Urgency</td><td style="padding: 8px; color: ${urgencyColor}; font-weight: bold;">${lead.urgencyLevel}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Lead Score</td><td style="padding: 8px;"><strong>${lead.leadScore}/100</strong></td></tr>
          <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Suggested Path</td><td style="padding: 8px;"><strong>${lead.suggestedPath}</strong></td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Tags</td><td style="padding: 8px;">${(lead.challengeTags ?? []).join(', ')}</td></tr>
          <tr style="background: #f8fafc;"><td style="padding: 8px; font-weight: bold;">Budget</td><td style="padding: 8px;">${lead.budgetRange}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Team Size</td><td style="padding: 8px;">${lead.teamSize}</td></tr>
        </table>
        <p style="margin-top: 16px; font-size: 13px; color: #64748b;">Assessment link has been sent to the client. Full briefing will be available after they complete the Systems Assessment.</p>
      </div>`;
    await this.send(consultantEmail, subject, html);
  }

  async sendBriefingNotification(lead: any, briefing: any) {
    const consultantEmail = process.env.CONSULTANT_EMAIL;
    if (!consultantEmail) return;

    const riskColor =
      briefing.riskLevel === 'HIGH' ? '#dc2626'
      : briefing.riskLevel === 'MEDIUM' ? '#d97706'
      : '#16a34a';

    const subject = `Pre-Call Brief Ready: ${lead.orgName} — ${briefing.recommendedService}`;
    const html = `
      <div style="font-family: Georgia, serif; max-width: 700px; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #0e7490); padding: 24px 32px;">
          <h1 style="color: white; margin: 0; font-size: 20px;">BTSLI™ — Consultant Pre-Call Brief</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0;">${lead.orgName} · ${lead.contactName}</p>
        </div>
        <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0;">

          <h2 style="color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Client Summary</h2>
          <p>${briefing.clientSummary}</p>

          <h3>Risk Level: <span style="color: ${riskColor};">${briefing.riskLevel}</span></h3>

          <h2 style="color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 28px;">Main Pain Points</h2>
          <ul>${briefing.mainPainPoints.map((p: string) => `<li>${p}</li>`).join('')}</ul>

          <h2 style="color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 28px;">Likely Root Causes</h2>
          <ul>${briefing.likelyRootCauses.map((c: string) => `<li>${c}</li>`).join('')}</ul>

          <h2 style="color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 28px;">Suggested Questions to Ask</h2>
          <ol>${briefing.suggestedQuestions.map((q: string) => `<li style="margin-bottom: 6px;">${q}</li>`).join('')}</ol>

          <h2 style="color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 28px;">Recommended Service Path</h2>
          <p style="font-size: 18px; font-weight: bold; color: #0891b2;">${briefing.recommendedService}</p>

          <h2 style="color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 28px;">Draft Follow-Up Email</h2>
          <pre style="background: white; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 14px;">${briefing.draftFollowUpEmail}</pre>

          <h2 style="color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 28px;">Draft Proposal Angle</h2>
          <pre style="background: white; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 14px;">${briefing.draftProposalAngle}</pre>

          <h2 style="color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 28px;">Draft KPIs / Success Metrics</h2>
          <ul>${briefing.draftKpis.map((k: string) => `<li>${k}</li>`).join('')}</ul>
        </div>
        <div style="padding: 16px; text-align: center; background: #1e293b;">
          <p style="margin: 0; color: #94a3b8; font-size: 12px;">BTSLI™ Internal Briefing Document · Generated ${new Date().toLocaleString()}</p>
        </div>
      </div>`;
    await this.send(consultantEmail, subject, html);
  }
}
