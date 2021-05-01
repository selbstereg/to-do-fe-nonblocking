
export class FiFo<E> {
  private elements: E[] = [];

  public add(el: E) {
    this.elements.push(el);
    console.log('Fifo.add: ', this.elements);
  }

  public peekCur(): E {
    return this.elements[0];
  }

  public popCur(): E {
    return this.elements.shift();
  }

  public isEmpty(): boolean {
    console.log('Fifo.isEmpty: ', this.elements);
    return this.elements.length === 0;
  }

  public isNotEmpty(): boolean {
    return !this.isEmpty();
  }
}
