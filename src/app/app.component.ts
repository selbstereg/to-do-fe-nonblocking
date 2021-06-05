import {Component, OnInit} from '@angular/core';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {ToDoListsGet} from './common/state/operations/to-do-lists-get';
import {Synchronizer} from './common/state/synchronizer.service';
import {ToDoList} from './common/state/glob-state';

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
  showToDoList = true;

  constructor(private synchronizer: Synchronizer) {
    this.selectFirstListIfPresent = this.selectFirstListIfPresent.bind(this);
  }

  ngOnInit(): void {
    this.synchronizer.addOperation(
      new ToDoListsGet(
        this.selectFirstListIfPresent
      )
    );
    this.selectFirstListIfPresent(this.synchronizer.getState());
  }

  private selectFirstListIfPresent(toDoLists: ToDoList[]) {
    const toDoList: ToDoList =
      toDoLists.length
        ? toDoLists[0]
        : {name: 'Keine Listen gefunden', id: null};
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

  toggleShowToDoList() {
    this.showToDoList = !this.showToDoList;
  }
}
