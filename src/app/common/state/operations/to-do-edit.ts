import {Operation} from './operation';
import uuidv4 from 'uuid/v4';
import {ToDoLists} from '../glob-state';


export default class ToDoEdit implements Operation {
  public endpoint = '/to-dos/edit';
  public operationId: string;

  constructor(
    public toDoId: string,
    public toDoName: string,
    public toDoDetails: string
  ) {
    this.operationId = uuidv4();
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
