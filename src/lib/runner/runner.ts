import { exec } from 'child_process';
import { promisify } from 'util';

export type TestStatus = 'pass' | 'fail';

export interface TestRecord {
  name: string;
  statusHistory: TestStatus[];
  passCount: number;
  failCount: number;
  flakeScore: number;
  isFlaky: boolean;
}

export interface RunnerResult {
  command: string;
  repeat: number;
  tests: TestRecord[];
}

const execAsync = promisify(exec);

export class Runner {
  constructor(private command: string, private repeat: number = 10) {}

  async run(): Promise<RunnerResult> {
    const map: Map<string, TestRecord> = new Map();

    for (let i = 0; i < this.repeat; i++) {
      const { stdout, stderr } = await execAsync(this.command, { maxBuffer: 1024 * 1024 * 10 });
      const output = stdout.toString() + '\n' + stderr.toString();
      const lines = output.split(/\r?\n/);
      for (const line of lines) {
        const passMatch = line.match(/^\s*[✓✔√]\s+(.*)/);
        const failMatch = line.match(/^\s*[✕✖×X]\s+(.*)/);
        if (passMatch || failMatch) {
          const status: TestStatus = passMatch ? 'pass' : 'fail';
          const name = (passMatch ? passMatch[1] : failMatch![1]).trim();
          let record = map.get(name);
          if (!record) {
            record = {
              name,
              statusHistory: [],
              passCount: 0,
              failCount: 0,
              flakeScore: 0,
              isFlaky: false,
            };
            map.set(name, record);
          }
          record.statusHistory.push(status);
          if (status === 'pass') {
            record.passCount += 1;
          } else {
            record.failCount += 1;
          }
        }
      }
    }

    // finalize records
    for (const record of Array.from(map.values())) {
      record.flakeScore = record.failCount / this.repeat * 100;
      record.isFlaky = record.failCount > 0;
    }

    return {
      command: this.command,
      repeat: this.repeat,
      tests: Array.from(map.values()),
    };
  }
}

