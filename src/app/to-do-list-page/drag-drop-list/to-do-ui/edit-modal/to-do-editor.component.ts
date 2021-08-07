import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Synchronizer} from '../../../../common/state/synchronizer.service';
import {ToDo} from '../../../../common/state/glob-state';
import ToDoEdit from '../../../../common/state/operations/to-do-edit';

@Component({
  selector: 'to-do-editor',
  templateUrl: './to-do-editor.component.html',
  styleUrls: ['./to-do-editor.component.css']
})
export class ToDoEditorComponent {

  // local state shared between angular components
  toDo: ToDo;
  editedName = '';
  editedDetails = '';

  constructor(
    private synchronizer: Synchronizer,
    private dialogRef: MatDialogRef<ToDoEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    this.toDo = this.data.toDoToEdit;
    this.editedName = this.toDo.name;
    this.editedDetails = this.toDo.details;
  }

  saveToDo() {
    // update component state
    this.toDo.name = this.editedName;
    this.toDo.details = this.editedDetails;

    // update global state
    this.synchronizer.addOperation(
      new ToDoEdit(
        this.toDo.id,
        this.toDo.name,
        this.toDo.details
      )
    );
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }
}
