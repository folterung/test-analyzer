import { exec$ } from './lib/rx-helpers/exec$';

import { ExecException } from 'child_process';
import { Observer } from 'rxjs';

const observer: Observer<string> = {
  next: (stdout: string) => {
    console.log('Output: ', stdout);
  },
  error: (err: ExecException) => {
    console.log(`Command: ${err.cmd}`);
    console.log(`Error code: ${err.code}`);
  },
  complete: () => {
    console.log('Observable has completed!');
  }
};

exec$('rm Spaghetti').subscribe(observer);
