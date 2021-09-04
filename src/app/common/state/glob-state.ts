import {Injectable} from '@angular/core';
import deepCopy from '../utils/deep-copy';
import {ToDoListStorageService} from './to-do-list-storage.service';

export interface ToDo {
  id: string;
  name: string;
  details: string;
}

export interface ToDoList {
  id: string;
  name: string;
  toDos: ToDo[];
  hasNewToDos: boolean;
}

// The app state as maintained by the app
export interface ToDoLists {
  toDoLists: ToDoList[];
}

// The response body as provided by the server
export interface StateSnapshot {
  operationId: string;
  toDoLists: ToDoList[];
}

export interface GlobStateMutation {
  apply: (globState: ToDoLists) => void;
}


@Injectable()
export class GlobState {
  private lastSeenState: ToDoLists = {toDoLists: []};

  constructor(private storage: ToDoListStorageService) {
    if (storage.toDoLists) {
      this.lastSeenState = { toDoLists: storage.toDoLists };
    }
  }

  public copyLastSeenState(): ToDoLists {
    return deepCopy(this.lastSeenState);
  }

  setLastSeenState(toDoLists: ToDoList[]) {
    this.lastSeenState.toDoLists = toDoLists;
    this.storage.saveToDoLists(toDoLists);
  }

  setHasNewToDosFalse(listId: string) {
    this.lastSeenState.toDoLists
      .filter(list => list.id === listId)
      .forEach(list => list.hasNewToDos = false);
    this.storage.saveToDoLists(this.lastSeenState.toDoLists);
  }
}
