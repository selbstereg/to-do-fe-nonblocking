import {Component, Input} from '@angular/core';
import {faHeart} from '@fortawesome/fontawesome-free-regular';
import {PLACEHOLDER_ADD_NEW_TO_DO} from '../common/constants';
import {ToDoList} from '../common/state/to-do-list-state/glob-state';
import {Synchronizer} from '../common/state/synchronizer.service';
import ToDoAdd from '../common/state/operations/to-do-add';
import ToDoDelete from '../common/state/operations/to-do-delete';
import {ToDoListsGet} from '../common/state/operations/to-do-lists-get';
import {MatDialog} from '@angular/material';
import {ShoppingFavouritesComponent} from './shopping-favourites/shopping-favourites.component';
import {filter} from 'rxjs/operators';
import {faAngleDoubleDown} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'to-do-list-page',
  templateUrl: './to-do-list-page.component.html',
  styleUrls: ['./to-do-list-page.component.css']
})
export class ToDoListPageComponent {

  @Input() selectedToDoList: ToDoList;

  readonly ITEM_ADDER_PLACEHOLDER = PLACEHOLDER_ADD_NEW_TO_DO;
  readonly faHeart = faHeart;
  readonly faAngleDoubleDown = faAngleDoubleDown;


  constructor(
    private synchronizer: Synchronizer,
    private dialogService: MatDialog
  ) {
    this.addAllShoppingItems = this.addAllShoppingItems.bind(this);
  }

  addToDo(toDoName: string): void {
    const toDoAdd =
      new ToDoAdd(
        toDoName,
        this.getListId()
      );

    // TODO: The angular component participates in processing the toDoAdd operation. This is a design flaw.
    //  The key to mending this is modelling order changes as Operations to put them into a temporal
    //  relationship with the other Operations.
    this.synchronizer.prependToOrder(this.getListId(), toDoAdd.toDoId);
    this.synchronizer.addOperations(toDoAdd);
  }

  onToDoDeleted(toDoId: string): void {
    this.synchronizer.addOperations(
      new ToDoDelete(
        toDoId,
        this.getListId()
      )
    );
  }

  onOrderChanged(toDoIdOrder: string[]): void {
    this.synchronizer.memorizeOrder(this.getListId(), toDoIdOrder);
  }

  onRefresh() {
    this.synchronizer.addOperations(new ToDoListsGet());
  }

  toDoListIsShoppingList(): boolean {
    return this.selectedToDoList.name.toUpperCase().includes('EINKAUF');
  }

  openShoppingFavouritesDialogue() {
    this.dialogService.open(ShoppingFavouritesComponent)
      .afterClosed()
      .pipe(filter(val => !!val))
      .subscribe(this.addAllShoppingItems);
  }

  addAllShoppingItems(selectedShoppingItems: string[]) {
    const toDoAddOperations = selectedShoppingItems.map(itemName => new ToDoAdd(
      itemName,
      this.getListId()
    ));
    toDoAddOperations.reverse().forEach(toDoAdd => this.synchronizer.prependToOrder(this.getListId(), toDoAdd.toDoId));
    this.synchronizer.addOperations(...toDoAddOperations);
  }

  getListId(): string {
    return this.selectedToDoList.id;
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
    this.synchronizer.setHasNewToDosFalse(this.selectedToDoList.id);
  }
}
