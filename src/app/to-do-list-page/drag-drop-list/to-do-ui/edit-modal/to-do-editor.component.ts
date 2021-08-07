import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {Synchronizer} from '../../../../common/state/synchronizer.service';
import {ToDo} from '../../../../common/state/glob-state';

@Component({
    selector: 'to-do-editor',
    templateUrl: './to-do-editor.component.html',
    styleUrls: ['./to-do-editor.component.css']
})
export class ToDoEditorComponent {

    toDo: ToDo;
    editedName = '';
    editedDetails = '';

    constructor(
        private synchronizer: Synchronizer,
        private dialogRef: MatDialogRef<ToDoEditorComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any) {
            this.toDo = this.data.toDoToEdit;
            this.editedName = this.toDo.name;
    }

    saveToDo() {
        this.toDo.name = this.editedName;
        // this.synchronizer.addOperation(new ToDoEdit())
        this.dialogRef.close();
    }

    cancel() {
      this.dialogRef.close();
    }
}
