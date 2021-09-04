import {Component, OnInit} from '@angular/core';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {ToDoListsGet} from './common/state/operations/to-do-lists-get';
import {Synchronizer} from './common/state/synchronizer.service';
import {ToDoList} from './common/state/to-do-list-state/glob-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  readonly faBars = faBars;
  selectedToDoList: ToDoList = null;
  sideNavOpened = false;
  listTitle = '';
  showLoggingPage = false;

  constructor(private synchronizer: Synchronizer) {
    this.selectFirstListIfPresent = this.selectFirstListIfPresent.bind(this);
    this.updateSelectedToDoListState = this.updateSelectedToDoListState.bind(this);
  }

  ngOnInit(): void {
    this.synchronizer.addOperations(new ToDoListsGet());
    this.selectFirstListIfPresent(this.synchronizer.getState());
    this.synchronizer.subscribe(list => {
        this.updateSelectedToDoListState(list);
      }
    ); // Component is never destroyed. No unsubscribe necessary.
  }

  private updateSelectedToDoListState(toDoLists: ToDoList[]) {
    const updatedSelectedToDoList = toDoLists.find(list => list.id === this.selectedToDoList.id);
    if (updatedSelectedToDoList) {
      this.selectedToDoList = updatedSelectedToDoList;
    } else {
      this.selectFirstListIfPresent(toDoLists);
    }
  }

  private selectFirstListIfPresent(toDoLists: ToDoList[]) {
    const toDoList: ToDoList =
      toDoLists.length
        ? toDoLists[0]
        : {name: 'Keine Listen gefunden', id: null, toDos: [], hasNewToDos: false};
    this.setSelectedToDoList(toDoList);
  }

  openSideNav() {
    this.sideNavOpened = true;
  }

  closeSideNav() {
    this.sideNavOpened = false;
  }

  setSelectedToDoList(toDoList: ToDoList) {
    this.selectedToDoList = toDoList;
    this.listTitle = toDoList.name;
  }

  onSelectToDoList(toDoList: ToDoList) {
    this.closeSideNav();
    this.setSelectedToDoList(toDoList);
  }

  toggleLoggingPage() {
    this.showLoggingPage = !this.showLoggingPage;
  }
}
