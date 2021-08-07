import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ToDo} from '../../../common/state/glob-state';
import {MatDialog} from '@angular/material';
import {ToDoEditorComponent} from './edit-modal/to-do-editor.component';


@Component({
  selector: 'to-do-ui',
  templateUrl: './to-do-ui.component.html',
  styleUrls: ['./to-do-ui.component.css']
})
export class ToDoUiComponent { // TODO Paul Bauknecht 07 08 2021: Rename to ToDoItemComponent
  @Input() toDo: ToDo;

  @Output() toDoDeleted = new EventEmitter<void>();

  constructor(private dialogService: MatDialog) {
  }

  onClick() {
      this.dialogService.open(ToDoEditorComponent, {
          minWidth: 280,
          data: {
              toDoToEdit: this.toDo
          }
      });
  }

  deleteToDo(): void {
    this.toDoDeleted.emit();
  }
}
