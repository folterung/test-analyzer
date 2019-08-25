import { exec, ExecException } from 'child_process';
import { Observable, Subscriber } from 'rxjs';

export const exec$ = (command: string) => {
  return new Observable<string>((subscriber: Subscriber<string>) => {
    exec(command, (error: ExecException | null, stdout: string) => {
      if (error) {
        subscriber.error(error);
      } else {
        subscriber.next(stdout);
      }

      subscriber.complete();
    });
  });
}
