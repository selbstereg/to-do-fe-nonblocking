import {Component, OnInit} from '@angular/core';
import {LogEntry, LoggingService} from '../common/logging/logging.service';

@Component({
  selector: 'logging-page',
  templateUrl: './logging-page.component.html'
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
  }

}
