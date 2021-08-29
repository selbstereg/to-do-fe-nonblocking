import {OperationBase} from './operation';
import uuidv4 from 'uuid/v4';
import {ToDoLists} from '../glob-state';

export default class ToDoListDelete extends OperationBase {
  public endpoint = '/to-do-lists/delete';

  constructor(
    public listId: string,
    public operationId = uuidv4()
  ) {
    super();
  }

  public static fromObject(obj: any): ToDoListDelete {
    return new ToDoListDelete(
      obj.listId,
      obj.operationId
    );
  }

  public apply = (globState: ToDoLists) => {
    globState.toDoLists =
      globState.toDoLists.filter(list => list.id !== this.listId);
  }
}
