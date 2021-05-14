import {ToDoList, ToDoLists} from '../glob-state.service';

export interface Operation {
  endpoint: string;
  operationId: string; // Needed, so BE can decide, if it already processed the operation.
  callback: (toDoLists: ToDoList[]) => void;
  apply: (globState: ToDoLists) => void;
}
