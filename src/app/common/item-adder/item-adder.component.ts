import {Component, Output, EventEmitter, Input, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {LoggingService} from '../logging/logging.service';

@Component({
  selector: 'item-adder',
  templateUrl: './item-adder.component.html',
  styleUrls: ['./item-adder.component.css']
})
export class ItemAdderComponent implements OnInit, OnChanges {
  // not using ngModel here because of bug where old text spontaneously appears again some time after item was added
  @ViewChild('input', {static: false}) input: ElementRef;
  @Input() placeholder = '';
  @Output() addItem = new EventEmitter<string>();

  constructor(private log: LoggingService) {
  }

  onAddItem() {
    const inputText: string = this.input.nativeElement.value;
    if (inputText) {
      this.addItem.emit(this.input.nativeElement.value);
    }
    this.input.nativeElement.value = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.log.info(`ItemAdder onChanges - changes=${JSON.stringify(changes)}`);
    this.log.info(`ItemAdder onChanges - input=${this.input.nativeElement.value}`);
  }

  ngOnInit(): void {
    this.log.info(`ItemAdder onInit - input=${this.input.nativeElement.value}`);
  }

}
