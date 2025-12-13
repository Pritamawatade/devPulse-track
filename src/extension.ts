import * as vscode from 'vscode';
import { Tracker } from './tracker';
import { Emailer } from './emailer';
import { Stats } from './stats';

let tracker: Tracker | undefined;
let emailer: Emailer | undefined;
let statusBarItem: vscode.StatusBarItem | undefined;
let dailyEmailTimeout: NodeJS.Timeout | undefined;

function updateStatusBar() {
  if (!tracker || !statusBarItem) return;
  
  const minutes = tracker.getTotalMinutes();
  statusBarItem.text = `⏱️ DevPulse: ${minutes} min${minutes !== 1 ? 's' : ''} today`;
  statusBarItem.tooltip = 'Click to view stats';
  statusBarItem.show();
}

async function sendDailyEmail() {
  if (!tracker || !emailer) return;
  
  try {
    const stats = new Stats(tracker);
    const report = await stats.generateReport();
    await emailer.sendDailyReport(report);
    console.log('Daily DevPulse email sent successfully');
  } catch (error) {
    console.error('Failed to send daily email:', error);
  }
}

function scheduleNextDailyEmail() {
  if (dailyEmailTimeout) {
    clearTimeout(dailyEmailTimeout);
  }

  const now = new Date();
  const targetTime = new Date(now);
  targetTime.setHours(23, 59, 0, 0);
  
  // If it's already past 23:59, schedule for next day
  if (now >= targetTime) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  const timeUntilTarget = targetTime.getTime() - now.getTime();
  
  dailyEmailTimeout = setTimeout(async () => {
    await sendDailyEmail();
    // Schedule next day's email after sending today's
    scheduleNextDailyEmail();
  }, timeUntilTarget);
}

export function activate(context: vscode.ExtensionContext) {
  // Initialize tracker and emailer
  tracker = new Tracker(context.globalState);
  try {
    emailer = new Emailer(vscode.workspace.getConfiguration('devpulse'));
  } catch (error) {
    console.warn('Failed to initialize emailer:', error);
  }

  // Setup status bar
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.command = 'devpulse.showStats';
  context.subscriptions.push(statusBarItem);
  updateStatusBar();

  // Update status bar every minute
  const statusBarUpdateInterval = setInterval(updateStatusBar, 60000);
  context.subscriptions.push({ dispose: () => clearInterval(statusBarUpdateInterval) });

  // Schedule daily email
  scheduleNextDailyEmail();

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('devpulse.startTracking', () => {
      tracker?.start();
      vscode.window.showInformationMessage('DevPulse tracking started.');
      updateStatusBar();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('devpulse.stopTracking', () => {
      tracker?.stop();
      vscode.window.showInformationMessage('DevPulse tracking stopped.');
      updateStatusBar();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('devpulse.showStats', async () => {
      if (!tracker) return;
      const stats = new Stats(tracker);
      const report = await stats.generateReport();
      
      // Create and show a webview panel to display the report
      const panel = vscode.window.createWebviewPanel(
        'devpulseStats',
        'DevPulse Stats',
        vscode.ViewColumn.One,
        {}
      );
      
      panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: var(--vscode-font-family); 
              padding: 20px;
              color: var(--vscode-foreground);
              background-color: var(--vscode-editor-background);
            }
            h1 { color: var(--vscode-textLink-foreground); }
            .project { margin: 10px 0; }
            .motivation { 
              font-style: italic; 
              margin: 20px 0;
              padding: 10px;
              background-color: var(--vscode-input-background);
              border-left: 3px solid var(--vscode-textLink-activeForeground);
            }
          </style>
        </head>
        <body>
          <h1>Your DevPulse Stats</h1>
          ${report}
        </body>
        </html>
      `;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('devpulse.sendTestEmail', async () => {
      if (!emailer) {
        vscode.window.showErrorMessage('Emailer not properly initialized. Check your Resend API key.');
        return;
      }
      try {
        await emailer.sendTestEmail();
        vscode.window.showInformationMessage('Test email sent successfully!');
      } catch (err) {
        vscode.window.showErrorMessage(
          `Failed to send test email: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    })
  );

  // Start tracking automatically on activation
  tracker.start();
  updateStatusBar();
}

export function deactivate() {
  if (dailyEmailTimeout) {
    clearTimeout(dailyEmailTimeout);
  }
  tracker?.stop();
  statusBarItem?.dispose();
}
