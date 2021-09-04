import {OperationBase} from './operation';
import uuidv4 from 'uuid/v4';
import {ToDoLists} from '../to-do-list-state/glob-state';


export default class ToDoEdit extends OperationBase {
  public endpoint = '/to-dos/edit';

  constructor(
    public toDoId: string,
    public toDoName: string,
    public toDoDetails: string,
    public operationId = uuidv4()
  ) {
    super();
  }

  public static fromObject(obj: any): ToDoEdit {
    return new ToDoEdit(
      obj.toDoId,
      obj.toDoName,
      obj.toDoDetails,
      obj.operationId
    );
  }

  apply(globState: ToDoLists): void {
    const toDoToEdit = globState.toDoLists
      .flatMap(toDoList => toDoList.toDos)
      .find(toDo => toDo.id === this.toDoId);

    if (toDoToEdit) {
      toDoToEdit.name = this.toDoName;
      toDoToEdit.details = this.toDoDetails;
    }
  }

}
