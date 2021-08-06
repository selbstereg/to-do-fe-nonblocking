import {Operation} from './operation';
import uuidv4 from 'uuid/v4';
import {ToDoLists} from '../glob-state';


export default class ToDoDelete implements Operation {
  public endpoint = '/to-dos/delete';
  public operationId: string;

  constructor(
    public toDoId: string,
    public listId: string
  ) {
    this.operationId = uuidv4();
  }

  public apply = (globState: ToDoLists) => {
    const toDoList = globState.toDoLists.find(list => list.id === this.listId);
    if (toDoList) {
      toDoList.toDos = toDoList.toDos.filter(
        toDo => toDo.id !== this.toDoId
      );
    }
  }
}
