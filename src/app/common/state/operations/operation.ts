import {GlobStateMutation, ToDoLists} from '../glob-state';

export interface Operation extends GlobStateMutation {
  endpoint: string;
  operationId: string; // Needed, so BE can decide, if it already processed the operation.
  toObject: () => {};
}

export abstract class OperationBase implements Operation {
  abstract endpoint: string;
  abstract operationId: string;

  abstract apply(globState: ToDoLists): void;

  toObject(): {} {
    return {
      ...this,
      type: this.constructor.name
    };
  }

}
