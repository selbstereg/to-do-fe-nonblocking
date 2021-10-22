import {Injectable} from '@angular/core';
import {Operation} from './operation';
import ToDoAdd from './to-do-add';
import {ToDoListsGet} from './to-do-lists-get';
import ToDoDelete from './to-do-delete';
import ToDoEdit from './to-do-edit';
import ToDoListAdd from './to-do-list-add';
import ToDoListDelete from './to-do-list-delete';

@Injectable()
export class OperationStorageService {
  private readonly operationsKey = 'operations';
  private operationGenerators = {
    [ToDoAdd.name]: (obj) => ToDoAdd.fromObject(obj),
    [ToDoDelete.name]: (obj) => ToDoDelete.fromObject(obj),
    [ToDoEdit.name]: (obj) => ToDoEdit.fromObject(obj),
    [ToDoListAdd.name]: (obj) => ToDoListAdd.fromObject(obj),
    [ToDoListDelete.name]: (obj) => ToDoListDelete.fromObject(obj),
    [ToDoListsGet.name]: (obj) => ToDoListsGet.fromObject(obj)
  };

  public operationInstances: Operation[];

  constructor() {
    const operations: string = window.localStorage.getItem(this.operationsKey);
    if (operations) {
      const operationObjects: any[] = JSON.parse(operations);
      this.operationInstances = operationObjects.map(obj => this.operationGenerators[obj.type](obj));
    }
  }

  saveOperations(operations: Operation[]) {
    const operationObjects = operations.map(op => op.toObject());
    window.localStorage.setItem(this.operationsKey, JSON.stringify(operationObjects));
  }
}
