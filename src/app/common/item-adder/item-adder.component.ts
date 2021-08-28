import {Component, Output, EventEmitter, Input, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'item-adder',
  templateUrl: './item-adder.component.html',
  styleUrls: ['./item-adder.component.css']
})
export class ItemAdderComponent {
  // not using ngModel here because of bug where old text spontaneously appears again some time after item was added
  @ViewChild('input', {static: false}) input: ElementRef;
  @Input() placeholder = '';
  @Output() addItem = new EventEmitter<string>();

  onAddItem() {
    const inputText: string = this.input.nativeElement.value;
    if (inputText) {
      this.addItem.emit(this.input.nativeElement.value);
    }
    this.input.nativeElement.value = '';
  }

}
