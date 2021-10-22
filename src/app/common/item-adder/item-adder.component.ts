import {Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {LoggingService} from '../logging/logging.service';

@Component({
  selector: 'item-adder',
  templateUrl: './item-adder.component.html',
  styleUrls: ['./item-adder.component.css']
})
export class ItemAdderComponent implements OnInit, OnChanges {
  @Input() placeholder = '';
  @Output() addItem = new EventEmitter<string>();
  input: string;
  isInputEmpty = true;

  constructor(private log: LoggingService) {
    log.info(`ItemAdder construcotr - input=${this.input}`);
  }

  onAddItem() {
    this.addItem.emit(this.input);
    this.input = '';
    this.isInputEmpty = true;
  }

  onInputChange(input: string) {
    this.isInputEmpty = input.length === 0;
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.log.info(`ItemAdder onChanges - changes=${JSON.stringify(changes)}`);
    this.log.info(`ItemAdder onChanges - input=${this.input}`);
  }

  ngOnInit(): void {
    this.log.info(`ItemAdder onInit - input=${this.input}`);
  }

}
