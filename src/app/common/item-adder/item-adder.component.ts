import {Component, Output, EventEmitter, Input} from '@angular/core';

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

  onAddItem() {
    this.addItem.emit(this.input);
    this.input = '';
    this.isInputEmpty = true;
  }

  onInputChange(input: string) {
    this.isInputEmpty = input.length === 0;
  }
}
