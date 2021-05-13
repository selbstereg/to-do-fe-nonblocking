import {Component, OnInit} from '@angular/core';
import {LogEntry, LoggingService, LogLvl} from '../common/logging/logging.service';

@Component({
  selector: 'logging-page',
  templateUrl: './logging-page.component.html',
  styleUrls: ['logging-page.component.css']
})
export class LoggingPageComponent implements OnInit {

  public logs: LogEntry[] = [];

  constructor(
    private log: LoggingService
  ) {
  }

  ngOnInit(): void {
    this.log.subscribe(
      logs => this.logs = logs
    );
    this.log.info('I just subscribed :)');
  }

  computeColor(logLevel: LogLvl) {
    switch (logLevel) {
      case LogLvl.WARN: return 'yellow';
      case LogLvl.ERROR: return 'red';
      case LogLvl.INFO: return 'white';
    }
  }
}
