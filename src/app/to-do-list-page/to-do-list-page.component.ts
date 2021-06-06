import {Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {faHeart} from '@fortawesome/fontawesome-free-regular';
import {PLACEHOLDER_ADD_NEW_TO_DO} from '../common/constants';
import {MatDialog} from '@angular/material';
import {filter} from 'rxjs/operators';
import {ToDo, ToDoList} from '../common/state/glob-state';
import {Synchronizer} from '../common/state/synchronizer.service';
import ToDoAdd from '../common/state/operations/to-do-add';
import {Subscription} from 'rxjs';

@Component({
  selector: 'to-do-list-page',
  templateUrl: './to-do-list-page.component.html',
  styleUrls: ['./to-do-list-page.component.css']
})
export class ToDoListPageComponent  implements OnInit/*, OnChanges */, OnDestroy {

  @Input() selectedToDoList: ToDoList;

  readonly ITEM_ADDER_PLACEHOLDER = PLACEHOLDER_ADD_NEW_TO_DO;
  readonly faHeart = faHeart;
  private globStateSubscription: Subscription;
  toDos: ToDo[] = [];


  constructor(
    private synchronizer: Synchronizer
  //   private dialogService: MatDialog
  ) {
  //    this.addToDo = this.addToDo.bind(this);
  //    this.fetchToDos = this.fetchToDos.bind(this);
  }

  ngOnInit(): void {
    // this.globStateSubscription = this.synchronizer.subscribe(
    //   lists => this.setToDos(lists)
    // );
  }

  ngOnDestroy(): void {
    this.globStateSubscription.unsubscribe(); // TODO Paul Bauknecht 06 06 2021: check if you forgot cleanup somewhere, e.g. in logging comp
  }

  // ngOnInit(): void {
  //   this.fetchToDos();
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.selectedToDoListChanged(changes)) {
  //     this.fetchToDos();
  //   }
  // }

  // toDoListIsEinkaufsliste(): boolean {
  //   return this.selectedToDoList.name.toUpperCase().includes('EINKAUF');
  // }

  onRefresh() {
  //   this.fetchToDos();
  }

  // openFavouriteEinkaufItemsDialog(): void {
  //   this.dialogService.open(FavouriteEinkaufItems)
  //     .afterClosed()
  //     .pipe(
  //       filter(val => !!val)
  //     )
  //     .subscribe(
  //       (selectedItems: string[]) => selectedItems.forEach(this.addToDo)
  //     );
  // }

  // private fetchToDos(): void {
  //   this.crudClient.fetchToDos(this.selectedToDoList.id).subscribe(
  //     (toDos: ToDo[]) => {
  //       this.toDos = toDos;
  //     }
  //   );
  // }

  addToDo(toDoName: string): void {
    this.synchronizer.addOperation(
      new ToDoAdd(
        toDoName,
        this.selectedToDoList.id,
        _ => {
          console.log(_);
          // do nothing...
          // const updatedSelectedList = toDoLists.find(list => list.id === this.selectedToDoList.id);
          // this.
        }
      )
    );

    // const toDo: ToDo = { name: toDoName, details: '', priority: this.calcHighestPrioPlusOne(), id: null };
    // this.toDos.push(toDo);
    // this.crudClient.addToDo(this.selectedToDoList.id, toDo).subscribe(
    //   this.fetchToDos,
    //   this.fetchToDos
    // );
  }


  // onToDoDeleted(toDoId: number): void {
  //   this.crudClient.deleteToDo(this.selectedToDoList.id, toDoId).subscribe(
  //     this.fetchToDos,
  //     this.fetchToDos
  //   );
  // }

  // onPriorizationChanged(updates: PriorityUpdate[]): void {
  //   this.crudClient.updatePriorities(updates).subscribe(
  //     this.fetchToDos,
  //     this.fetchToDos
  //   );
  // }

  // private selectedToDoListChanged(changes: SimpleChanges) {
  //   return changes.selectedToDoList;
  // }

  // private calcHighestPrioPlusOne(): number {
  //   const priorities: number[] = this.toDos.map(toDo => toDo.priority);
  //   if (!priorities.length) {
  //     return 0;
  //   }
  //   return Math.max(...priorities) + 1;
  // }
}
