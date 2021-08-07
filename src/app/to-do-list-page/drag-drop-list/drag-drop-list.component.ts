import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ToDo} from '../../common/state/glob-state';

// export interface PriorityUpdate {
//   toDoId: number;
//   priority: number;
// }

@Component({
  selector: 'drag-drop-list',
  templateUrl: './drag-drop-list.component.html',
  styleUrls: ['./drag-drop-list.component.css']
})
export class DragDropListComponent {

  @Input() toDos: ToDo[] = [];

  @Output() toDoDeleted = new EventEmitter<string>();
  // string[] is array of to-do ids
  @Output() orderChanged = new EventEmitter<string[]>();

  drop(event: CdkDragDrop<string[]>): void {

    moveItemInArray(
      this.toDos,
      this.mapToReverseOrder(event.previousIndex),
      this.mapToReverseOrder(event.currentIndex)
    );

    const order: string[] = this.toDos.map(toDo => toDo.id);
    this.orderChanged.emit(order);
    //   this.isDragging = false;
    //   moveItemInArray(
    //     this.toDos,
    //     this.mapToReverseOrder(event.previousIndex),
    //     this.mapToReverseOrder(event.currentIndex)
    //   );
    //   this.prioritizationDebounceTimer.stop();
    //   this.prioritizationDebounceTimer.start(this.submitPriorityOrder);
  }

  mapToReverseOrder(index: number): number {
    return this.toDos.length - 1 - index;
  }

  // submitPriorityOrder(): void {
  //   const updates: PriorityUpdate[] = [];
  //   this.toDos.forEach(
  //     (toDo, index) => {
  //       if (toDo.priority !== index) {
  //         toDo.priority = index;
  //         updates.push({toDoId: toDo.id, priority: toDo.priority});
  //       }
  //     }
  //   );
  //   if (updates.length && !this.isDragging) {
  //     this.prioritizationChanged.emit(updates);
  //   }
  // }

  deleteToDo(toDo: ToDo): void {
    this.toDoDeleted.emit(toDo.id);
  }

  getToDosInReverseOrder(): ToDo[] {
    const toDosCopy = this.toDos.slice();
    return toDosCopy.reverse();
  }

}
