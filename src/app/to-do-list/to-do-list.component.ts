import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { faHeart } from '@fortawesome/fontawesome-free-regular'
import { NamedEntity } from './model/named-entity.model';
import { PLACEHOLDER_ADD_NEW_TO_DO } from '../common/constants';
import { ToDo } from './model/to-do.model';
import { CrudClient } from '../common/services/crud-client.service';
import { MatDialog } from '@angular/material';
import { FavouriteEinkaufItems } from '../favourite-einkauf-items/favourite-einkauf-items.component';
import { filter } from 'rxjs/operators';

// TODO: This component does too many things. It should be split up.
@Component({
  selector: 'to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit, OnChanges {
  
  @Input() selectedToDoList: NamedEntity;

  readonly ITEM_ADDER_PLACEHOLDER = PLACEHOLDER_ADD_NEW_TO_DO;
  readonly faHeart = faHeart;
  toDos: ToDo[] = [];
  markedToDos: ToDo[] = [];
  
  constructor(
    private crudClient: CrudClient,
    private dialogService: MatDialog
  ) {
    this.addToDo = this.addToDo.bind(this);
    this.fetchToDos = this.fetchToDos.bind(this)
  }

  ngOnInit(): void {
    this.fetchToDos();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedToDoListChanged(changes)) {
      this.fetchToDos();
    }
  }

  onRefresh() {
    this.fetchToDos();
  }

  // TODO: The logic to mark list items is duplicated (here and in favoureite-inkauf-items.component)
  onClickToDo(clickedToDo: ToDo) {
    if (this.isMarked(clickedToDo)) {
      this.markedToDos = this.markedToDos.filter(toDo => toDo !== clickedToDo);
    } else {
      this.markedToDos.push(clickedToDo);
    }
  }

  isMarked(clickedToDo: ToDo): boolean {
    return this.markedToDos.includes(clickedToDo);
  }

  styleMarkedToDos(toDo: ToDo) {
      return this.isMarked(toDo) ? 'marked-to-do' : '';
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.toDos, event.previousIndex, event.currentIndex);
  }

  toDoListIsEinkaufsliste(): boolean {
    return this.selectedToDoList.name.toUpperCase().includes('EINKAUF');
  }

  openFavouriteEinkaufItemsDialog(): void {
    this.dialogService.open(FavouriteEinkaufItems)
      .afterClosed()
      .pipe(
        filter(val => !!val)
      )
      .subscribe(
        (selectedItems: string[]) => selectedItems.forEach(this.addToDo)
      );
  }

  private fetchToDos(): void {
    this.crudClient.fetchToDos(this.selectedToDoList.id).subscribe(
      (toDos: ToDo[]) => {
        this.toDos = toDos.reverse()
      }
    );
  }

  addToDo(toDoName: string): void {
    const toDo: ToDo = { name: toDoName, priority: this.calcHighestPrioPlusOne(), id: null };
    this.toDos.push(toDo);
    this.crudClient.addToDo(this.selectedToDoList.id, toDo).subscribe(
      this.fetchToDos,
      this.fetchToDos
    );
  }

  calcHighestPrioPlusOne(): number {
    const priorities: number[] = this.toDos.map(toDo => toDo.priority);
    return Math.max(...priorities) + 1;
  }

  deleteToDo(toDo: ToDo): void {
    this.crudClient.deleteToDo(this.selectedToDoList.id, toDo.id).subscribe(
      this.fetchToDos,
      this.fetchToDos
    );
  }

  private selectedToDoListChanged(changes: SimpleChanges) {
    return changes.selectedToDoList;
  }

}
