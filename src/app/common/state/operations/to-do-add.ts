import {Operation} from './operation';
import uuidv4 from 'uuid/v4';
import {ToDoLists} from '../glob-state';

export default class ToDoAdd implements Operation {
  public endpoint = '/to-dos/add';
  public operationId: string;
  public toDoId: string;

  constructor(
    public toDoName: string,
    public listId: string
  ) {
    this.operationId = uuidv4();
    this.toDoId = uuidv4();
  }

  public apply = (globState: ToDoLists) => {
    const toDoList = globState.toDoLists.find(list => list.id === this.listId);
    if (toDoList) {
      toDoList.toDos.push(
        {
          name: this.toDoName,
          id: this.toDoId
        }
      );
    } // TODO Paul Bauknecht 06 06 2021: Can it happen, that the list can't be found?
  }
}
