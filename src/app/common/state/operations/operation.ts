import {GlobStateMutation, ToDoLists} from '../glob-state';

export interface Operation extends GlobStateMutation {
  endpoint: string;
  operationId: string; // Needed, so BE can decide, if it already processed the operation.
}
