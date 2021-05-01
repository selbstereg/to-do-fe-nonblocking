import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {NamedEntity, ToDoListsGet} from '../to-do-list-page/model/to-do-list.model';
import {PLACEHOLDER_ADD_NEW_TO_DO_LIST} from '../common/constants';
import {Synchronizer} from '../common/operation/synchronizer.service';
import {MatDialog} from '@angular/material';
import {ConfirmationDialogComponent} from '../common/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'to-do-list-selection',
  templateUrl: './to-do-list-selection.component.html',
  styleUrls: ['./to-do-list-selection.component.css']
})
export class ToDoListSelectionComponent implements OnInit {

  @Input() selectedToDoList: NamedEntity;
  @Output() selectToDoList = new EventEmitter<NamedEntity>();

  readonly ITEM_ADDER_PLACEHOLDER = PLACEHOLDER_ADD_NEW_TO_DO_LIST;
  toDoLists: NamedEntity[] = [];

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
        (toDoLists: NamedEntity[]) => this.toDoLists = toDoLists
      )
    );
  }

  onSelect(toDoList: NamedEntity) {
    this.selectToDoList.emit(toDoList);
  }

  onAddToDoList(listName: string) {
    // this.synchronizer.addToDoList(listName).subscribe(
    //   (body: NamedEntity) => this.selectToDoList.emit(body)
    // );
  }

  // TODO: Add error toast, if list or to do can't be found
  onClickDeleteButton(toDoList: NamedEntity) {
    // this.dialogService.open(ConfirmationDialogComponent, {data: {text: `"${toDoList.name}" wirklich löschen?`}})
    //   .afterClosed()
    //   .subscribe(confirmed => {
    //       if (confirmed) {
    //         this.deleteToDoList(toDoList);
    //       }
    //     }
    //   );
  }

  private deleteToDoList(toDoList: NamedEntity) {
    // this.synchronizer.deleteToDoList(toDoList.id).subscribe(
    //   this.fetchToDoLists,
    //   this.fetchToDoLists
    // );
    // if (toDoList.id === this.selectedToDoList.id) {
    //   this.selectToDoList.emit(this.toDoLists[0]);
    // }
  }
}
