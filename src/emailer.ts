import { Resend } from 'resend';
import * as vscode from 'vscode';

export class Emailer {
  private resendApiKey: string;
  private resend: Resend | undefined;

  constructor(config: vscode.WorkspaceConfiguration) {
    this.resendApiKey = config.get('resendApiKey', '');
    if (!this.resendApiKey) {
      throw new Error('Resend API key is missing in configuration (devpulse.resendApiKey).');
    }
    this.resend = new Resend(this.resendApiKey);
  }

  async sendDailyReport(htmlContent: string) {
    if (!this.resend) throw new Error('Resend client not initialized.');
    await this.resend.emails.send({
      from: 'DevPulse <onboarding@resend.dev>',
      to: ['pritamawatade5@gmail.com'],
      subject: 'Your DevPulse Daily Report',
      html: htmlContent
    });
  }

  async sendTestEmail(html?: string) {
    if (!this.resend) throw new Error('Resend client not initialized.');
    const content = html || '<strong>It works!</strong>';
    await this.resend.emails.send({
      from: 'DevPulse <onboarding@resend.dev>',
      to: ['pritamawatade5@gmail.com'],
      subject: 'DevPulse Test Email',
      html: content
    });
  }
}
