import {OperationBase} from './operation';
import uuidv4 from 'uuid/v4';
import {ToDoLists} from '../to-do-list-state/glob-state';


export default class ToDoDelete extends OperationBase {
  public endpoint = '/to-dos/delete';

  constructor(
    public toDoId: string,
    public listId: string,
    public operationId = uuidv4()
  ) {
    super();
  }

  public static fromObject(obj: any): ToDoDelete {
    return new ToDoDelete(
      obj.toDoId,
      obj.listId,
      obj.operationId
    );
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
