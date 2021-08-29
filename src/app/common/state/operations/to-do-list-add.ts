import {OperationBase} from './operation';
import uuidv4 from 'uuid/v4';
import {ToDoLists} from '../glob-state';

export default class ToDoListAdd extends OperationBase {
  public endpoint = '/to-do-lists/add';

  constructor(
    public listName: string,
    public operationId = uuidv4(),
    public listId = uuidv4()
  ) {
    super();
  }

  public static fromObject(obj: any): ToDoListAdd {
    return new ToDoListAdd(
      obj.listName,
      obj.operationId,
      obj.listId
    );
  }

  public apply = (globState: ToDoLists) => {
    globState.toDoLists.push(
      {
        name: this.listName,
        id: this.listId,
        toDos: [],
        hasNewToDos: false
      }
    );
  }
}
