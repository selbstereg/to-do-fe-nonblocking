import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';


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

  logs: LogEntry[] = [
    {level: LogLvl.INFO, message: 'info msg', time: new Date()},
    {level: LogLvl.WARN, message: 'warn msg', time: new Date()},
    {level: LogLvl.ERROR, message: 'error msg', time: new Date()},
  ];

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
    return {
      level,
      message,
      time: new Date()
    };
  }

  private add(entry: LogEntry) {
    this.logs.unshift(entry);
    this.logsSubject.next(this.logs);
  }

}
