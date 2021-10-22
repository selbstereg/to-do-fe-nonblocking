import {Injectable} from '@angular/core';
import {ToDoList} from './glob-state';

@Injectable()
export class ToDoListStorageService {
  private readonly toDoListsKey = 'to-do-lists';
  public toDoLists: ToDoList[];

  constructor() {
    const toDoListsAsJson = window.localStorage.getItem(this.toDoListsKey);
    if (toDoListsAsJson) {
      this.toDoLists = JSON.parse(toDoListsAsJson);
    }
  }

  saveToDoLists(toDoLists: ToDoList[]) {
    window.localStorage.setItem(this.toDoListsKey, JSON.stringify(toDoLists));
  }
}
