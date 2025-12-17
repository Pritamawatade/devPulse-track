import * as vscode from 'vscode';

export class Emailer {
  private resendApiKey: string;
  private resend: any;

  constructor(config: vscode.WorkspaceConfiguration) {
    this.resendApiKey = config.get('resendApiKey', '');
    if (!this.resendApiKey) {
      throw new Error('Resend API key is missing in configuration (devpulse.resendApiKey).');
    }
  }

  private async initializeResend() {
    if (this.resend) return this.resend;

    try {
      const { Resend } = await import('resend');
      this.resend = new Resend(this.resendApiKey);
      return this.resend;
    } catch (error) {
      throw new Error(`Failed to initialize Resend: ${error}`);
    }
  }

  async sendDailyReport(htmlContent: string) {
    const resend = await this.initializeResend();
    await resend.emails.send({
      from: 'DevPulse <onboarding@resend.dev>',
      to: ['pritamawatade5@gmail.com'],
      subject: 'Your DevPulse Daily Report',
      html: htmlContent
    });
  }

  async sendTestEmail(html?: string) {
    const resend = await this.initializeResend();
    const content = html || '<strong>It works!</strong>';
    await resend.emails.send({
      from: 'DevPulse <onboarding@resend.dev>',
      to: ['pritamawatade5@gmail.com'],
      subject: 'DevPulse Test Email',
      html: content
    });
  }
}
