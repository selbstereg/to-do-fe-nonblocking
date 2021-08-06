import { Component, Input, Output, EventEmitter } from '@angular/core';
import {ToDo} from '../../../common/state/glob-state';



@Component({
    selector: 'to-do-ui',
    templateUrl: './to-do-ui.component.html',
    styleUrls: ['./to-do-ui.component.css']
})
export class ToDoUiComponent {
    @Input() toDo: ToDo;

    // TODO: it is cumbersome, to reach this event up by two components, so it can be
    // submitted to the BE with the to do list id. Check if there is a way to delete
    // the to do from the @OneToMany relation, without knowing the to do list.
    @Output() toDoDeleted = new EventEmitter<void>();

    // constructor(private dialogService: MatDialog) {
    // }

    // onClick() {
    //     this.dialogService.open(ToDoEditorComponent, {
    //         minWidth: 280,
    //         data: {
    //             toDoToEdit: this.toDo
    //         }
    //     });
    // }
    //
    deleteToDo(): void {
        this.toDoDeleted.emit();
    }
}
