import {OperationBase} from './operation';
import uuidv4 from 'uuid/v4';
import {ToDoLists} from '../glob-state';

export default class ToDoAdd extends OperationBase {
  public endpoint = '/to-dos/add';

  constructor(
    public toDoName: string,
    public listId: string,
    public operationId = uuidv4(),
    public toDoId = uuidv4()
  ) {
    super();
  }

  public static fromObject(obj: any): ToDoAdd {
    return new ToDoAdd(
      obj.toDoName,
      obj.listId,
      obj.operationId,
      obj.toDoId
    );
  }

  public apply = (globState: ToDoLists) => {
    const toDoList = globState.toDoLists.find(list => list.id === this.listId);
    if (toDoList) {
      toDoList.toDos.push(
        {
          name: this.toDoName,
          id: this.toDoId,
          details: ''
        }
      );
    } // TODO Paul Bauknecht 06 06 2021: Can it happen, that the list can't be found?
  }
}
