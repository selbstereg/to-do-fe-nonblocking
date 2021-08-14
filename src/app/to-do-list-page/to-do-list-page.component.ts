import {Component, Input} from '@angular/core';
import {faHeart} from '@fortawesome/fontawesome-free-regular';
import {PLACEHOLDER_ADD_NEW_TO_DO} from '../common/constants';
import {ToDo, ToDoList} from '../common/state/glob-state';
import {Synchronizer} from '../common/state/synchronizer.service';
import ToDoAdd from '../common/state/operations/to-do-add';
import ToDoDelete from '../common/state/operations/to-do-delete';
import {ToDoListsGet} from '../common/state/operations/to-do-lists-get';

@Component({
  selector: 'to-do-list-page',
  templateUrl: './to-do-list-page.component.html',
  styleUrls: ['./to-do-list-page.component.css']
})
export class ToDoListPageComponent {

  @Input() selectedToDoList: ToDoList;

  readonly ITEM_ADDER_PLACEHOLDER = PLACEHOLDER_ADD_NEW_TO_DO;
  readonly faHeart = faHeart;


  constructor(
    private synchronizer: Synchronizer,
  ) {
  }

  addToDo(toDoName: string): void {
    const toDoAdd =
      new ToDoAdd(
        toDoName,
        this.selectedToDoList.id
      );

    // TODO: The angular component participates in processing the toDoAdd operation. This is a design flaw.
    //  The key to mending this is modelling order changes as Operations to put them into a temporal
    //  relationship with the other Operations.
    const order = [toDoAdd.toDoId].concat(this.getToDos().map(toDo => toDo.id));
    this.onOrderChanged(order);
    this.synchronizer.addOperation(toDoAdd);
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

  getToDos(): ToDo[] {
    return this.selectedToDoList.toDos;
  }

  onRefresh() {
    this.synchronizer.addOperation(new ToDoListsGet());
  }

}
