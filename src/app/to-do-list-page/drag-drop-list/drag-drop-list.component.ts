import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ToDo} from '../../common/state/glob-state';

@Component({
  selector: 'drag-drop-list',
  templateUrl: './drag-drop-list.component.html',
  styleUrls: ['./drag-drop-list.component.css']
})
export class DragDropListComponent {

  @Input() toDos: ToDo[] = [];

  @Output() toDoDeleted = new EventEmitter<string>();
  @Output() orderChanged = new EventEmitter<string[]>();

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.toDos,
      event.previousIndex,
      event.currentIndex
    );

    const order: string[] = this.toDos.map(toDo => toDo.id);
    this.orderChanged.emit(order);
  }

  deleteToDo(toDo: ToDo): void {
    this.toDoDeleted.emit(toDo.id);
  }

}
