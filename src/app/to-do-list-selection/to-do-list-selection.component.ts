import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToDoListsGet} from '../to-do-list-page/model/to-do-list.model';
import {PLACEHOLDER_ADD_NEW_TO_DO_LIST} from '../common/constants';
import {Synchronizer} from '../common/operation/synchronizer.service';
import {MatDialog} from '@angular/material';
import {ToDoList} from '../common/operation/glob-state.service';


@Component({
  selector: 'to-do-list-selection',
  templateUrl: './to-do-list-selection.component.html',
  styleUrls: ['./to-do-list-selection.component.css']
})
export class ToDoListSelectionComponent implements OnInit {

  @Input() selectedToDoList: ToDoList;
  @Output() selectToDoList = new EventEmitter<ToDoList>();

  readonly ITEM_ADDER_PLACEHOLDER = PLACEHOLDER_ADD_NEW_TO_DO_LIST;
  toDoLists: ToDoList[] = [];

  constructor(
    private synchronizer: Synchronizer,
    private dialogService: MatDialog
  ) {
    this.fetchToDoLists = this.fetchToDoLists.bind(this);
    this.deleteToDoList = this.deleteToDoList.bind(this);
  }

  ngOnInit(): void {
    this.fetchToDoLists();
  }

  fetchToDoLists() {
    this.synchronizer.fetchToDoLists(
      new ToDoListsGet(
        (toDoLists: ToDoList[]) => this.toDoLists = toDoLists
      )
    );
  }

  onSelect(toDoList: ToDoList) {
    this.selectToDoList.emit(toDoList);
  }

  onAddToDoList(listName: string) {
    // this.synchronizer.addToDoList(listName).subscribe(
    //   (body: ToDoList) => this.selectToDoList.emit(body)
    // );
  }

  // TODO: Add error toast, if list or to do can't be found
  onClickDeleteButton(toDoList: ToDoList) {
    // this.dialogService.open(ConfirmationDialogComponent, {data: {text: `"${toDoList.name}" wirklich löschen?`}})
    //   .afterClosed()
    //   .subscribe(confirmed => {
    //       if (confirmed) {
    //         this.deleteToDoList(toDoList);
    //       }
    //     }
    //   );
  }

  private deleteToDoList(toDoList: ToDoList) {
    // this.synchronizer.deleteToDoList(toDoList.id).subscribe(
    //   this.fetchToDoLists,
    //   this.fetchToDoLists
    // );
    // if (toDoList.id === this.selectedToDoList.id) {
    //   this.selectToDoList.emit(this.toDoLists[0]);
    // }
  }
}
