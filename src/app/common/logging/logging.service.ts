import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';


export enum LogLvl {
  INFO,
  WARN,
  ERROR
}

export interface LogEntry {
  level: LogLvl;
  message: string;
  time: Date;
}

@Injectable()
export class LoggingService {
  logsSubject = new Subject<LogEntry[]>();
  logs: LogEntry[] = [];

  public subscribe(callback: (logs: LogEntry[]) => void) {
    this.logsSubject.subscribe(callback);
  }

  public info(message: string) {
    const entry = this.createEntry(message, LogLvl.INFO);
    this.add(entry);
  }

  public warn(message: string) {
    const entry = this.createEntry(message, LogLvl.WARN);
    this.add(entry);
  }

  public error(message: string) {
    const entry = this.createEntry(message, LogLvl.ERROR);
    this.add(entry);
  }

  private createEntry(message: string, level: LogLvl): LogEntry {
    if (environment.logToConsole) {
      console.log(message);
    }

    return {
      level,
      message,
      time: new Date()
    };
  }

  private add(entry: LogEntry) {
    this.logs.unshift(entry);
    this.logsSubject.next(this.logs);
    if (this.logs.length > 1000) {
      this.logs.pop();
    }
  }

}
