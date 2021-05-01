import {Component, OnInit} from '@angular/core';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {NamedEntity} from './to-do-list-page/model/named-entity.model';
import {CrudClient, ToDoListsGet} from './common/services/crud-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly faBars = faBars;
  selectedToDoList: NamedEntity = null;
  sideNavOpened = false;
  listTitle = '';

  constructor(private crudClient: CrudClient) {
  }

  // TODO Paul Bauknecht 19.04.2020: Verbessere verhalten, wenn es noch keine Listen gibt oder die letzte gelöscht wurde
  ngOnInit(): void {
    this.crudClient.startSync();
    this.crudClient.fetchToDoLists(
      new ToDoListsGet(
        (toDoLists: NamedEntity[]) => {
          const toDoList: NamedEntity =
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

  setSelectedToDoList(toDoList: NamedEntity) {
    this.selectedToDoList = toDoList;
    this.listTitle = toDoList.name;
  }

  onSelectToDoList(toDoList: NamedEntity) {
    this.closeSideNav();
    this.setSelectedToDoList(toDoList);
  }
}
