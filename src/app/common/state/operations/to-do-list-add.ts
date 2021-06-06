import {Operation} from './operation';
import uuidv4 from 'uuid/v4';
import {ToDoList, ToDoLists} from '../glob-state';

export default class ToDoListAdd implements Operation {
  public endpoint = '/to-do-lists/add';
  public operationId: string;
  public listId: string;

  constructor(
    public listName: string
  ) {
    this.operationId = uuidv4();
    this.listId = uuidv4();
  }

  public apply = (globState: ToDoLists) => {
    globState.toDoLists.push(
      {
        name: this.listName,
        id: this.listId,
        toDos: []
      }
    );
  }
}
