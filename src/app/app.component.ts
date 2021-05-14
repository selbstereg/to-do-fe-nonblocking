import {Component, OnInit} from '@angular/core';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {ToDoListsGet} from './to-do-list-page/model/to-do-list.model';
import {Synchronizer} from './common/operation/synchronizer.service';
import {ToDoList} from './common/operation/glob-state.service';

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

  constructor(private synchronizer: Synchronizer) {
  }

  // TODO Paul Bauknecht 19.04.2020: Verbessere verhalten, wenn es noch keine Listen gibt oder die letzte gelöscht wurde
  ngOnInit(): void {
    this.synchronizer.fetchToDoLists(
      new ToDoListsGet(
        (toDoLists: ToDoList[]) => {
          const toDoList: ToDoList =
            toDoLists.length
              ? toDoLists[0]
              : { name: 'Keine Listen gefunden', id: null };
          this.setSelectedToDoList(toDoList);
        }
      )
    );
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
}
