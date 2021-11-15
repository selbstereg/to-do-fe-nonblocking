import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

const MAX_NUM_CHARACTERS = 245;

@Component({
  selector: 'item-adder',
  templateUrl: './item-adder.component.html',
  styleUrls: ['./item-adder.component.css']
})
export class ItemAdderComponent implements OnInit {
  @Input() placeholder = '';
  @Output() addItem = new EventEmitter<string>();
  input: string;

  itemAdderForm: FormGroup;

  constructor() {
  }

  ngOnInit(): void {
    this.itemAdderForm = new FormGroup({
      inputField: new FormControl(
        '',
        [
          Validators.maxLength(MAX_NUM_CHARACTERS),
          Validators.required
        ]
      )
    });
  }

  onSubmit() {
    this.addItem.emit(this.itemAdderForm.controls.inputField.value);
    this.itemAdderForm.reset();
  }
}
