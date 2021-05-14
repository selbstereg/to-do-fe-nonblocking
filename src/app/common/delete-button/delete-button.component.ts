import { Component, Output, EventEmitter } from '@angular/core';

// TODO Paul Bauknecht 14 05 2021: maybe create folter app/common/components and move all the ui stuff there, but only once the ui is re
//  created. If you keep the current folder structure, you won't have to care about the imports, when copying the old code.
@Component({
  selector: 'delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.css']
})
export class DeleteButtonComponent {
  @Output() delete = new EventEmitter<void>();

  onClick() {
    this.delete.emit();
  }
}

