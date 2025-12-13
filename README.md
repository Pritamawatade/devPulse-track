
# DevPulse Daily — VS Code Extension

DevPulse Daily tracks your active coding time inside VS Code and composes a daily email summary with your coding stats. It's intended to help developers monitor daily productivity, keep track of time spent per project, and send a summarized report at the end of each day.

---

## 🔑 Features

- Track active coding time per project
- Automatic daily email report sent at 23:59 local time
- Status bar indicator displaying today’s cumulative coding minutes
- Commands to start/stop tracking, show a detailed stats webview, and send a test email

---

## ⚙️ Configuration

Add your Resend API key to the workspace or user settings in VS Code (Settings UI or `settings.json`):

```json
"devpulse.resendApiKey": "YOUR_RESEND_API_KEY"
```

Note: At present the recipient email is hard-coded in `src/emailer.ts`. Consider making the recipient configurable before publishing the extension.

---

## 🛠️ Commands

- `DevPulse: Start Tracking` — Start tracking your active coding time
- `DevPulse: Stop Tracking` — Stop tracking
- `DevPulse: Show Stats` — Displays the daily report and project breakdown in a webview
- `DevPulse: Send Test Email` — Sends a test email to validate your Resend API key

---

## 🚀 Local Setup

1. Clone the repository and navigate to the project folder:

```bash
git clone <repo-url>
cd vscode-extension
```

2. Install dependencies:

```bash
npm install
```

3. Build TypeScript:

```bash
npm run compile
```

4. Launch the extension in the Extension Development Host for local testing:

- Press `F5` in VS Code to run the extension in a new Extension Development Host window.
- For iterative development, run:

```bash
npm run watch
```

---

## 📦 Packaging & Local Installation

To create a .vsix package for distribution or local installation:

```bash
npm run package
```

Install the resulting `.vsix` in your main VS Code instance:

```bash
code --install-extension ./devpulse-daily-1.0.0.vsix
```

You can also install from the VS Code UI: Extensions → ... → Install from VSIX…

---

## 🧪 Manual Testing

1. Launch the Development Host (F5).
2. Use the command palette to run `DevPulse: Start Tracking` and `DevPulse: Show Stats`.
3. Edit files or move within editors to generate activity and verify the status bar updates.
4. Use `DevPulse: Send Test Email` after setting `devpulse.resendApiKey` and validate an email is sent.
5. Inspect logs: In the Extension Development Host window use `Help → Toggle Developer Tools` and `View → Output` → Log (Extension Host).

---

## ⚠️ Security & Operational Notes

- `devpulse.resendApiKey` should be stored as a secret and not committed to version control; use workspace or user settings.
- Do not commit `node_modules`, the compiled `out/` directory, `.vscode/`, or `.vsix` files (see `.gitignore`).
- The extension relies on the `resend` library; validate that the library is compatible with your targeted Node version used by VS Code.

---

## ✅ Recommended Improvements

1. Add `devpulse.recipientEmail` to `contributes.configuration` in `package.json` and use it in `Emailer`.
2. Implement proper disposal for `Tracker` event listeners to avoid memory leaks and ensure a clean shutdown.
3. Add `.vscodeignore` and consider bundling for smaller package size.
4. Add `repository` and `license` fields to `package.json` and create a `LICENSE` file.

---

## 📄 License

MIT
# DevPulse Daily VS Code Extension

DevPulse Daily tracks your active coding time inside VS Code and sends you a daily email summary with your coding stats.

## Features

- Tracks active coding time per project
- Sends daily email report at 23:59 local time
- Shows coding streak and motivational messages
- Status bar item shows live coding time
- Commands to start/stop tracking, show stats, and send test email

## Configuration

Set your Resend API key in VS Code settings:

```json
"devpulse.resendApiKey": "YOUR_API_KEY"
```

## Commands

- `DevPulse: Start Tracking` - Start tracking active coding time
- `DevPulse: Stop Tracking` - Stop tracking
- `DevPulse: Show Stats` - Show detailed stats in a webview
- `DevPulse: Send Test Email` - Send a test email to verify configuration

## Development

### Setup

1. Install dependencies:

```bash
npm install
```

2. Compile the extension:

```bash
npm run compile
```

### Running

- Press `F5` in VS Code to launch an Extension Development Host with the extension loaded.

### Packaging

- Use the following command to package the extension:

```bash
npm run package
```

### Publishing

- Publish with `vsce`:

```bash
vsce publish
```

Make sure you have a publisher configured and logged in.

## License

MIT
