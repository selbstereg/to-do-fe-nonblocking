import {Operation} from './operation';
import uuidv4 from 'uuid/v4';
import {ToDoList, ToDoLists} from '../glob-state';

export default class ToDoListDelete implements Operation {
  public endpoint = '/to-do-lists/delete';
  public operationId: string;

  constructor(
    public listId: string,
    public callback: (toDoLists: ToDoList[]) => void
  ) {
    this.operationId = uuidv4();
  }

  public apply = (globState: ToDoLists) => {
    globState.toDoLists =
      globState.toDoLists.filter(list => list.id !== this.listId);
  }
}
