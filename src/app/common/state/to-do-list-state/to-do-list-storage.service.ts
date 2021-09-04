import {Injectable} from '@angular/core';
import {LoggingService} from '../../logging/logging.service';
import {ToDoList} from './glob-state';

@Injectable()
export class ToDoListStorageService {
  private readonly toDoListsKey = 'to-do-lists';
  public toDoLists: ToDoList[];

  constructor(private log: LoggingService) {
    log.warn('loading to do lists from local storage');
    const toDoListsAsJson = window.localStorage.getItem(this.toDoListsKey);
    if (toDoListsAsJson) {
      this.toDoLists = JSON.parse(toDoListsAsJson);
      const listNames = this.toDoLists.map(list => list ? list.name : list);
      log.info('loaded to do lists: ' + JSON.stringify(listNames));
    }
  }

  saveToDoLists(toDoLists: ToDoList[]) {
    window.localStorage.setItem(this.toDoListsKey, JSON.stringify(toDoLists));
  }
}
