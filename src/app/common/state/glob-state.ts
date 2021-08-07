import {Injectable} from '@angular/core';

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

@Injectable()
export class GlobState {
  private lastSeenState: ToDoLists = { toDoLists: [] };

  public copyLastSeenState(): ToDoLists {
    // deep copy
    return JSON.parse(JSON.stringify(this.lastSeenState));
  }

  setLastSeenState(toDoLists: ToDoList[]) {
    this.lastSeenState.toDoLists = toDoLists;
  }
}
