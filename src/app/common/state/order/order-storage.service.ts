import {Injectable} from '@angular/core';

@Injectable()
export class OrderStorageService {
  private readonly orderStateKey = 'order-state';

  public listIdToItemOrderMap: Map<string, string[]>;

  constructor() {
    const orderStateAsJson: string = window.localStorage.getItem(this.orderStateKey);
    if (orderStateAsJson) {
      const orderStateAsArray: [string, string[]][] = JSON.parse(orderStateAsJson);
      this.listIdToItemOrderMap = new Map(orderStateAsArray);
    }
  }


  saveOrderState(orderState: Map<string, string[]>) {
    const orderStateAsArray: [string, string[]][] = Array.from(orderState);
    window.localStorage.setItem(this.orderStateKey, JSON.stringify(orderStateAsArray));
  }
}
