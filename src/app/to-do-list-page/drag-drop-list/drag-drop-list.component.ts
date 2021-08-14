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
      this.mapToReverseOrder(event.previousIndex),
      this.mapToReverseOrder(event.currentIndex)
    );

    const order: string[] = this.toDos.map(toDo => toDo.id);
    this.orderChanged.emit(order);
  }

  mapToReverseOrder(index: number): number {
    return this.toDos.length - 1 - index;
  }

  deleteToDo(toDo: ToDo): void {
    this.toDoDeleted.emit(toDo.id);
  }

  getToDosInReverseOrder(): ToDo[] {
    const toDosCopy = this.toDos.slice();
    return toDosCopy.reverse();
  }

}
