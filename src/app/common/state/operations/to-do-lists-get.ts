import {OperationBase} from './operation';
import uuidv4 from 'uuid/v4';

export class ToDoListsGet extends OperationBase {
  public endpoint = '/to-do-lists/get';

  constructor(
    public operationId = uuidv4()
  ) {
    super();
  }

  public static fromObject(obj: any): ToDoListsGet {
    return new ToDoListsGet(
      obj.operationId
    );
  }

  public apply = _ => {
    // do nothing
  }
}
