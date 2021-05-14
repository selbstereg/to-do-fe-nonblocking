import {ToDoList, ToDoLists} from './glob-state.service';

export enum OperationType {
  TO_DO_LISTS_GET
}

export interface Operation {
  operationType: OperationType;
  operationId: string; // Needed, so BE can decide, if it already processed the operation.
  callback: (toDoLists: ToDoList[]) => void;
  apply: (globState: ToDoLists) => void;
}
