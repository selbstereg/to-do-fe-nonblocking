import {ToDoLists} from '../glob-state';

export interface Operation {
  endpoint: string;
  operationId: string; // Needed, so BE can decide, if it already processed the operation.
  apply: (globState: ToDoLists) => void;
}
