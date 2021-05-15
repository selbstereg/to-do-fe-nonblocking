import {Injectable} from '@angular/core';
import {Operation} from './operations/operation';


class FiFo<E> {
  private elements: E[] = [];

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

}


