import {Injectable} from '@angular/core';
import deepCopy from '../utils/deep-copy';

export interface ToDo {
  id: string;
  name: string;
  details: string;
}

export interface ToDoList {
  id: string;
  name: string;
  toDos: ToDo[];
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
  private lastSeenState: ToDoLists = { toDoLists: [] };

  public copyLastSeenState(): ToDoLists {
    return deepCopy(this.lastSeenState);
  }

  setLastSeenState(toDoLists: ToDoList[]) {
    this.lastSeenState.toDoLists = toDoLists;
  }
}
