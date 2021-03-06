import {Injectable} from '@angular/core';
import {Operation} from './operation';
import {Subject} from 'rxjs';
import {OperationStorageService} from './operation-storage.service';
import ToDoAdd from './to-do-add';


class OperationFifo<E> {
  protected elements: E[] = [];

  public add(el: E) {
    this.elements.push(el);
  }

  public peekCur(): E {
    return this.elements[0];
  }

  public popCur(): E {
    return this.elements.shift();
  }

  public isEmpty(): boolean {
    return this.elements.length === 0;
  }

  public isNotEmpty(): boolean {
    return !this.isEmpty();
  }

  public forEach(fun: (element: E) => void) {
    this.elements.forEach(element => fun(element));
  }
}

@Injectable()
export class OperationFiFo extends OperationFifo<Operation> {

  private numElementsSubject = new Subject<number>();

  constructor(private storage: OperationStorageService) {
    super();
    if (storage.operationInstances) {
      this.elements = storage.operationInstances;
    }
  }

  public add(el: Operation) {
    super.add(el);
    this.onStateChange();
  }

  public popCur(): Operation {
    const operation = super.popCur();
    this.onStateChange();
    return operation;
  }

  public onStateChange() {
    this.storage.saveOperations(this.elements);
    this.numElementsSubject.next(this.getNumberOfOperations());
  }

  public subscribe(callback: (value: number) => void) {
    this.numElementsSubject.subscribe(callback);
  }

  public getNumberOfOperations(): number {
    return this.elements.length;
  }

  public getToDoAddOperations(): ToDoAdd[] {
    return this.elements.filter(operation => operation instanceof ToDoAdd) as ToDoAdd[];
  }
}


