import {Operation} from '../../common/operation/operation';
import uuidv4 from 'uuid/v4';
import {TO_DO_LISTS_ENDPOINT_URL} from '../../common/constants';
import {ToDoList} from '../../common/operation/glob-state.service';

export class ToDoListsGet implements Operation {
  public endpoint = TO_DO_LISTS_ENDPOINT_URL;
  public operationId: string;

  constructor(
    public callback: (toDoLists: ToDoList[]) => void,
  ) {
    this.operationId = uuidv4();
  }

  public apply = _ => {
    // do nothing
  }
}
