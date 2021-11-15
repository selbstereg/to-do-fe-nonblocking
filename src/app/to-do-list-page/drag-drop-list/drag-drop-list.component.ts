import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ToDo} from '../../common/state/to-do-list-state/glob-state';

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
    // TODO Paul Bauknecht 15 11 2021: drag is no longer possible if list is updated during ongoing drag. Should be fixed in newer version:
    //  https://github.com/angular/components/issues/18628 (workaround proposed here does not work!!!)
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
