import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'logging-page',
  templateUrl: './logging-page.component.html'
})
export class LoggingPageComponent implements OnInit {

  public logs: string[] = [
    'lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet'
  ];

  ngOnInit(): void {
  }

}
