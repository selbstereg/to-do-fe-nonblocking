import {Injectable} from '@angular/core';
import {Operation} from './operations/operation';
import {Subject} from 'rxjs';


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
    this.numElementsSubject.next(this.elements.length);
  }

  public popCur(): Operation {
    const operation = super.popCur();
    this.numElementsSubject.next(this.elements.length);
    return operation;
  }

  public subscribe(callback: (value: number) => void) {
    this.numElementsSubject.subscribe(callback);
  }
}


