import * as vscode from 'vscode';

const ACTIVE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

interface ProjectTime {
  [projectName: string]: number; // milliseconds
}

interface SavedData {
  projectTimes?: ProjectTime;
  startOfDay?: number;
  languageTimes?: { [language: string]: number };
}

export class Tracker {
  private _globalState: vscode.Memento;
  private _active: boolean = false;
  private _lastActivity: number = 0;
  private _intervalId: NodeJS.Timeout | undefined;
  private _projectTimes: ProjectTime = {};
  private _languageTimes: { [language: string]: number } = {};
  private _startOfDay: number = 0;

  constructor(globalState: vscode.Memento) {
    this._globalState = globalState;
    this._load();
    this._resetIfNeeded();
  }

  private _load() {
    const data = this._globalState.get<SavedData>('devpulse-tracking-data', {});
    this._projectTimes = data.projectTimes || {};
    this._startOfDay = data.startOfDay || Date.now();
    this._languageTimes = data.languageTimes || {};
  }

  private _save() {
    this._globalState.update('devpulse-tracking-data', {
      projectTimes: this._projectTimes,
      startOfDay: this._startOfDay
      , languageTimes: this._languageTimes
    });
  }

  private _resetIfNeeded() {
    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    if (this._startOfDay < todayStart.getTime()) {
      this._projectTimes = {};
      this._startOfDay = todayStart.getTime();
      this._save();
    }
  }

  start() {
    if (this._intervalId) return; // already started

    this._active = true;
    this._lastActivity = Date.now();

    vscode.window.onDidChangeTextEditorSelection(this._onUserActivity, this, []);
    vscode.workspace.onDidChangeTextDocument(this._onUserActivity, this, []);
    vscode.window.onDidChangeActiveTextEditor(this._onUserActivity, this, []);

    this._intervalId = setInterval(() => {
      this._checkActivity();
    }, 1000);
  }

  stop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = undefined;
    }
    this._active = false;
  }
  private _onUserActivity() {
    this._lastActivity = Date.now();
  }

  private _checkActivity() {
    const now = Date.now();
    if (now - this._lastActivity <= ACTIVE_TIMEOUT) {
      this._active = true;
      this._addActiveTime(1000);
    } else {
      this._active = false;
    }
    this._resetIfNeeded();
  }

  private _addActiveTime(ms: number) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
    if (!workspaceFolder) return;

    const projectName = workspaceFolder.name;
    if (!this._projectTimes[projectName]) {
      this._projectTimes[projectName] = 0;
    }
    this._projectTimes[projectName] += ms;
    // track language times
    const lang = editor.document.languageId || 'unknown';
    if (!this._languageTimes[lang]) {
      this._languageTimes[lang] = 0;
    }
    this._languageTimes[lang] += ms;
    this._save();
  }

  getTotalMinutes(): number {
    let total = 0;
    for (const key in this._projectTimes) {
      total += this._projectTimes[key];
    }
    return Math.floor(total / 60000);
  }

  getProjectTimes(): ProjectTime {
    return this._projectTimes;
  }

  getLanguageTimes(): { [language: string]: number } {
    return this._languageTimes;
  }

  getStartOfDay(): number {
    return this._startOfDay;
  }
}
