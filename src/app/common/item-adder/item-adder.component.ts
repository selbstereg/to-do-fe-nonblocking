import {Component, Output, EventEmitter, Input} from '@angular/core';
import {LoggingService} from '../logging/logging.service';

@Component({
  selector: 'item-adder',
  templateUrl: './item-adder.component.html',
  styleUrls: ['./item-adder.component.css']
})
export class ItemAdderComponent {
  @Input() placeholder = '';
  @Output() addItem = new EventEmitter<string>();
  input: string;
  isInputEmpty = true;

  constructor(private log: LoggingService) {
  }

  onAddItem() {
    this.log.warn('onAddItem -----');
    this.log.info(`input: \"${this.input}\"`);
    this.log.info(`isInputEmpty: ${this.isInputEmpty}`);
    this.addItem.emit(this.input);
    this.log.info(`emitted - now clear input`);
    this.input = '';
    this.log.info(`input: \"${this.input}\"`);
    this.isInputEmpty = true;
    this.log.info(`isInputEmpty: ${this.isInputEmpty}`);
  }

  onInputChange(input: string) {
    this.isInputEmpty = input.length === 0;
  }
}
