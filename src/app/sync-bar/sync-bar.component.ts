import {Component, OnInit} from '@angular/core';
import {OperationFiFo} from '../common/state/fifo';

@Component({
  selector: 'sync-bar',
  templateUrl: './sync-bar.component.html',
  styleUrls: ['./sync-bar.component.css']
})
export class SyncBarComponent implements OnInit {
  numPendingOperations = 0;

  constructor(
    private operationFiFo: OperationFiFo
  ) {
  }

  ngOnInit(): void {
    this.operationFiFo.subscribe(
      (numPendingOperations: number) => this.numPendingOperations = numPendingOperations
    );
  }
}
