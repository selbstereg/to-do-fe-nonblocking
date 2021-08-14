import {Component, Input} from '@angular/core';
import {faHeart} from '@fortawesome/fontawesome-free-regular';
import {PLACEHOLDER_ADD_NEW_TO_DO} from '../common/constants';
import {ToDo, ToDoList} from '../common/state/glob-state';
import {Synchronizer} from '../common/state/synchronizer.service';
import ToDoAdd from '../common/state/operations/to-do-add';
import ToDoDelete from '../common/state/operations/to-do-delete';
import {LoggingService} from '../common/logging/logging.service';

@Component({
  selector: 'to-do-list-page',
  templateUrl: './to-do-list-page.component.html',
  styleUrls: ['./to-do-list-page.component.css']
})
export class ToDoListPageComponent {

  @Input() selectedToDoList: ToDoList;

  readonly ITEM_ADDER_PLACEHOLDER = PLACEHOLDER_ADD_NEW_TO_DO;
  readonly faHeart = faHeart;
  toDos: ToDo[] = [];


  constructor(
    private synchronizer: Synchronizer,
    private log: LoggingService
  ) {
  }

  addToDo(toDoName: string): void {
    this.log.info('addToDo: ' + this.toDos.toString());
    this.onOrderChanged(
      this.toDos.map(toDo => toDo.id)
    );
    this.synchronizer.addOperation(
      new ToDoAdd(
        toDoName,
        this.selectedToDoList.id
      )
    );
  }

  onToDoDeleted(toDoId: string): void {
    this.synchronizer.addOperation(
      new ToDoDelete(
        toDoId,
        this.selectedToDoList.id
      )
    );
  }

  onOrderChanged(toDoIdOrder: string[]): void {
    this.synchronizer.memorizeOrder(this.selectedToDoList.id, toDoIdOrder);
  }

  onRefresh() {
  }

}
