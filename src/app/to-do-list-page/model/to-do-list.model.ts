import {Operation, OperationType} from '../../common/operation/operation';
import uuidv4 from 'uuid/v4';

export interface NamedEntity {
    readonly id: string;
    name: string;
}

export class ToDoListsGet implements Operation<NamedEntity[]> {
  public operationType = OperationType.TO_DO_LISTS_GET; // TODO Paul Bauknecht 01 05 2021: iS THIS NEEDED?
  public operationId: string;

  constructor(
    public callback: (toDoLists: NamedEntity[]) => void,
  ) {
    this.operationId = uuidv4();
  }
}
