import {Injectable} from '@angular/core';
import {LoggingService} from '../logging/logging.service';

@Injectable()
export class OrderStorageService {
  private readonly orderStateKey = 'order-state';

  public listIdToItemOrderMap: Map<string, string[]>;

  constructor(private log: LoggingService) {
    log.warn('loading order state from local storage');
    const orderStateAsJson: string = window.localStorage.getItem(this.orderStateKey);
    if (orderStateAsJson) {
      const orderStateAsArray: [string, string[]][] = JSON.parse(orderStateAsJson);
      log.info('loaded order state: ' + orderStateAsJson); // TODO Paul Bauknecht 04 09 2021: Remove debug logging
      this.listIdToItemOrderMap = new Map(orderStateAsArray);
    }
  }


  saveOrderState(orderState: Map<string, string[]>) {
    const orderStateAsArray: [string, string[]][] = Array.from(orderState);
    window.localStorage.setItem(this.orderStateKey, JSON.stringify(orderStateAsArray));
  }
}
