import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToDoListsGet} from '../common/state/operations/to-do-lists-get';
import {PLACEHOLDER_ADD_NEW_TO_DO_LIST} from '../common/constants';
import {Synchronizer} from '../common/state/synchronizer.service';
import {MatDialog} from '@angular/material';
import {ToDoList} from '../common/state/glob-state';
import ToDoListAdd from '../common/state/operations/to-do-list-add';
import {ConfirmationDialogComponent} from '../common/confirmation-dialog/confirmation-dialog.component';
import ToDoListDelete from '../common/state/operations/to-do-list-delete';


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
    this.synchronizer.addOperation(
      new ToDoListsGet(
        (toDoLists: ToDoList[]) => this.toDoLists = toDoLists
      )
    );
    this.toDoLists = this.synchronizer.getState();
  }

  onSelect(toDoList: ToDoList) {
    this.selectToDoList.emit(toDoList);
  }

  onAddToDoList(listName: string) {
    this.synchronizer.addOperation(
      new ToDoListAdd(
        listName,
        (toDoLists: ToDoList[]) => this.toDoLists = toDoLists
      )
    );
    this.toDoLists = this.synchronizer.getState();
  }

  onClickDeleteButton(toDoList: ToDoList) {
    this.dialogService.open(ConfirmationDialogComponent, {data: {text: `"${toDoList.name}" wirklich löschen?`}})
      .afterClosed()
      .subscribe(confirmed => {
          if (confirmed) {
            this.deleteToDoList(toDoList);
          }
        }
      );
  }

  private deleteToDoList(toDoList: ToDoList) {
    this.synchronizer.addOperation(
      new ToDoListDelete(
        toDoList.id,
        (toDoLists: ToDoList[]) => this.toDoLists = toDoLists
      )
    );
    this.toDoLists = this.synchronizer.getState();
  }
}
