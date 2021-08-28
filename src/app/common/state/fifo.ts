import {Injectable} from '@angular/core';
import {Operation} from './operations/operation';
import {Subject} from 'rxjs';
import ToDoAdd from './operations/to-do-add';


class FiFo<E> {
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
export class OperationFiFo extends FiFo<Operation> {

  private numElementsSubject = new Subject<number>();

  public add(el: Operation) {
    super.add(el);
    this.updateSubscribers();
  }

  public popCur(): Operation {
    const operation = super.popCur();
    this.updateSubscribers();
    return operation;
  }

  public subscribe(callback: (value: number) => void) {
    this.numElementsSubject.subscribe(callback);
  }

  private updateSubscribers() {
    this.numElementsSubject.next(this.getNumberOfOperations());
  }

  public getNumberOfOperations(): number {
    return this.elements.length;
  }

  public getToDoAddOperations(): ToDoAdd[] {
    return this.elements.filter(operation => operation instanceof ToDoAdd)as ToDoAdd[];
  }
}


