import {Injectable} from '@angular/core';
import {LoggingService} from '../logging/logging.service';
import {Operation} from './operations/operation';
import ToDoAdd from './operations/to-do-add';
import {ToDoListsGet} from './operations/to-do-lists-get';
import ToDoDelete from './operations/to-do-delete';
import ToDoEdit from './operations/to-do-edit';
import ToDoListAdd from './operations/to-do-list-add';
import ToDoListDelete from './operations/to-do-list-delete';

@Injectable()
export class LocalStorageService {
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

  constructor(private log: LoggingService) {
    log.warn('loading state from local storage');
    const operations: string = window.localStorage.getItem(this.operationsKey);
    log.info('loaded operations: ' + operations);
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
