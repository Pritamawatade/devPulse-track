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

    let projectBreakdown = '';
    for (const project in projectTimes) {
      const mins = Math.floor(projectTimes[project] / 60000);
      projectBreakdown += `<li>${project}: ${mins} minutes</li>`;
    }

    const html = `
      <h1>Your DevPulse Daily Report</h1>
      <p><strong>Total active coding time:</strong> ${totalMinutes} minutes</p>
      <p><strong>Time spent per project:</strong></p>
      <ul>${projectBreakdown}</ul>
      <p><strong>Coding streak:</strong> ${streak} days</p>
      <p><em>Motivational message:</em> ${motivational}</p>
      <p><em>Remember to keep coding tomorrow!</em></p>
    `;

    return html;
  }

  getRandomMotivationalMessage(): string {
    const index = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    return MOTIVATIONAL_MESSAGES[index];
  }
}
