import {Operation} from './operation';
import uuidv4 from 'uuid/v4';
import {ToDoList} from '../glob-state';

export class ToDoListsGet implements Operation {
  public endpoint = '/to-do-lists/get';
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
