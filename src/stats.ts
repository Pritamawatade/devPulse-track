import { Tracker } from './tracker';

const MOTIVATIONAL_MESSAGES = [
  "Keep pushing forward!",
  "Great job today, keep it up!",
  "Coding is your superpower!",
  "Every line of code counts!",
  "Stay curious and keep learning!",
  "You are making progress!",
  "One step at a time!",
  "Consistency is key!",
  "Believe in yourself!",
  "Your hard work will pay off!",
  "Keep calm and code on!",
  "You are a coding rockstar!",
  "Debugging is just a puzzle!",
  "Make every minute count!",
  "Keep your eyes on the prize!",
  "Code like a champion!",
  "Your streak is unstoppable!",
  "Push your limits!",
  "Stay focused and motivated!",
  "You are building something great!",
  "Keep climbing higher!",
  "Your passion shows!",
  "Celebrate your wins!",
  "Keep the momentum going!",
  "You are a problem solver!",
  "Coding is fun, enjoy it!",
  "Stay positive and productive!",
  "Your skills are growing!",
  "Keep learning new things!",
  "You are making a difference!",
  "Code with confidence!"
];

export class Stats {
  private tracker: Tracker;

  constructor(tracker: Tracker) {
    this.tracker = tracker;
  }

  getCodingStreak(): number {
    // For simplicity, let's assume streak is number of consecutive days with >0 coding time
    // This should be stored and tracked, but here we simulate with a stub
    // TODO: Implement persistent streak tracking
    return 1;
  }

  async generateReport(): Promise<string> {
    const totalMinutes = this.tracker.getTotalMinutes();
    const projectTimes = this.tracker.getProjectTimes();
    const streak = this.getCodingStreak();
    const motivational = this.getRandomMotivationalMessage();
    const languageTimes = this.tracker.getLanguageTimes ? this.tracker.getLanguageTimes() : {};

    // Determine top language
    let topLanguage = 'N/A';
    let topLangMinutes = 0;
    for (const lang in languageTimes) {
      const mins = Math.floor(languageTimes[lang] / 60000);
      if (mins > topLangMinutes) {
        topLangMinutes = mins;
        topLanguage = lang;
      }
    }


    let projectBreakdown = '';
    for (const project in projectTimes) {
      const mins = Math.floor(projectTimes[project] / 60000);
      projectBreakdown += `<li>${project}: ${mins} minutes</li>`;
    }

    let languageBreakdown = '';
    for (const lang in languageTimes) {
      const mins = Math.floor(languageTimes[lang] / 60000);
      languageBreakdown += `<li>${lang}: ${mins} minutes</li>`;
    }

    const totalMinutesNumber = Number(totalMinutes);

    const colors = ['#6366F1', '#06B6D4', '#F97316', '#10B981', '#EF4444'];
    function colorFor(i: number) { return colors[i % colors.length]; }

    // Build project rows with progress bars
    let projectRows = '';
    const projectEntries = Object.entries(projectTimes).map(([name, ms]) => ({ name, mins: Math.floor(ms / 60000) }));
    // sort projects by minutes desc
    projectEntries.sort((a, b) => b.mins - a.mins);
    for (let i = 0; i < projectEntries.length; i++) {
      const p = projectEntries[i];
      const pct = totalMinutesNumber > 0 ? Math.round((p.mins / totalMinutesNumber) * 100) : 0;
      projectRows += `
        <tr>
          <td style="padding:6px 0; width:35%; vertical-align:middle;">${p.name}</td>
          <td style="padding:6px 0; width:40%; vertical-align:middle;">
            <div style="background:#f1f5f9;border-radius:6px;height:12px;width:100%;overflow:hidden;">
              <div style="width:${pct}%;height:100%;background:${colorFor(i)};border-radius:6px 0 0 6px;"></div>
            </div>
          </td>
          <td style="padding:6px 0; width:25%; text-align:right; vertical-align:middle;">${p.mins} min (${pct}%)</td>
        </tr>
      `;
    }

    // Build language rows
    let languageRows = '';
    const languageEntries = Object.entries(languageTimes).map(([name, ms]) => ({ name, mins: Math.floor(ms / 60000) }));
    // sort languages by minutes desc
    languageEntries.sort((a, b) => b.mins - a.mins);
    for (let i = 0; i < languageEntries.length; i++) {
      const l = languageEntries[i];
      const pct = totalMinutesNumber > 0 ? Math.round((l.mins / totalMinutesNumber) * 100) : 0;
      languageRows += `
        <tr>
          <td style="padding:6px 0; width:55%; vertical-align:middle;">${l.name}</td>
          <td style="padding:6px 0; width:35%; vertical-align:middle;">
            <div style="background:#f1f5f9;border-radius:6px;height:8px;width:100%;overflow:hidden;">
              <div style="width:${pct}%;height:100%;background:${colorFor(i)};border-radius:6px 0 0 6px;"></div>
            </div>
          </td>
          <td style="padding:6px 0; width:10%; text-align:right; vertical-align:middle;">${l.mins}m</td>
        </tr>
      `;
    }

    const headerDate = new Date().toLocaleDateString();

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color:#0f172a; max-width:600px; margin:0 auto;">
        <div style="background:linear-gradient(90deg, #4F46E5, #06B6D4); color:#fff; padding:18px 20px; border-radius:10px 10px 6px 6px;">
          <h2 style="margin:0;font-size:18px;">DevPulse Daily Report</h2>
          <div style="font-size:12px; opacity:0.95; margin-top:6px;">${headerDate}</div>
        </div>

        <div style="background:#fff; padding:18px; border:1px solid #e6edf3; border-top:0; border-radius:0 0 6px 6px;">

          <table style="width:100%;border-collapse:collapse; margin-bottom:12px;">
            <tr>
              <td style="padding:8px; width:33%;">
                <div style="background:#f8fafc;padding:12px;border-radius:8px;text-align:center;">
                  <div style="font-size:12px;color:#667085;margin-bottom:6px;">Total time</div>
                  <div style="font-size:18px;font-weight:600;">${totalMinutes} min</div>
                </div>
              </td>
              <td style="padding:8px; width:33%;">
                <div style="background:#f8fafc;padding:12px;border-radius:8px;text-align:center;">
                  <div style="font-size:12px;color:#667085;margin-bottom:6px;">Top language</div>
                  <div style="font-size:16px;font-weight:600;">${topLanguage}</div>
                  <div style="font-size:12px;color:#94a3b8;">${topLangMinutes} min</div>
                </div>
              </td>
              <td style="padding:8px; width:34%;">
                <div style="background:#f8fafc;padding:12px;border-radius:8px;text-align:center;">
                  <div style="font-size:12px;color:#667085;margin-bottom:6px;">Streak</div>
                  <div style="font-size:18px;font-weight:600;">${streak}d</div>
                </div>
              </td>
            </tr>
          </table>

          <h3 style="margin:12px 0 8px 0; font-size:15px; color:#0f172a;">Project Breakdown</h3>
          <table style="width:100%;border-collapse:collapse; margin-bottom:12px;">
            ${projectRows || '<tr><td style="padding:6px 0;">No project data for today.</td></tr>'}
          </table>

          <h3 style="margin:12px 0 8px 0; font-size:15px; color:#0f172a;">Language Breakdown</h3>
          <table style="width:100%;border-collapse:collapse; margin-bottom:12px;">
            ${languageRows || '<tr><td style="padding:6px 0;">No language data for today.</td></tr>'}
          </table>

          <div style="margin:12px 0;padding:12px;border-left:4px solid #06B6D4;background:#f1faff;border-radius:6px;">
            <div style="font-size:13px;font-weight:600;color:#035388; margin-bottom:6px;">Motivation</div>
            <div style="font-size:14px;color:#083344;">${motivational}</div>
          </div>

          <p style="font-size:12px;color:#475569;margin-top:12px;">Keep up the good work — see you tomorrow! 🚀</p>
        </div>
      </div>
    `;

    return html;
  }

  getRandomMotivationalMessage(): string {
    const index = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    return MOTIVATIONAL_MESSAGES[index];
  }
}
