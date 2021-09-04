import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL, SYNC_INTERVAL_MS} from '../constants';
import {take} from 'rxjs/operators';
import DebounceTimer from '../utils/debounce-timer';
import {Operation} from './operations/operation';
import {OperationFiFo} from './operations/operation-fifo';
import {LoggingService} from '../logging/logging.service';
import {GlobState, StateSnapshot, ToDoList} from './to-do-list-state/glob-state';
import {Subject, Subscription} from 'rxjs';
import {OrderState} from './order/order-state';

@Injectable()
export class Synchronizer {
  private requestInProgress = false;
  private syncTimer: DebounceTimer = new DebounceTimer(SYNC_INTERVAL_MS);

  private globStateSubject = new Subject<ToDoList[]>();

  constructor(
    private httpClient: HttpClient,
    private log: LoggingService,
    private globState: GlobState,
    private fiFo: OperationFiFo,
    private orderState: OrderState
  ) {
    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) {
          this.syncTimer.stop();
        } else {
          this.sync();
        }
      });
  }

  public addOperations(...operations: Operation[]) {
    operations.reverse().forEach(operation => this.fiFo.add(operation));
    this.updateSubscribers(this.getState());
    this.sync();
  }

  private sync() {
    this.syncTimer.stop();
    if (this.fiFo.isNotEmpty() && !this.requestInProgress) {
      const operation = this.fiFo.peekCur();
      this.issueRequest(operation);
    }
  }

  private issueRequest(operation: Operation) {
    this.requestInProgress = true;
    this.httpClient
      .post(API_URL + operation.endpoint, operation)
      .pipe(take(1))
      .subscribe(
        (snapshot: StateSnapshot) => {
          this.setNewToDosFlags(snapshot.toDoLists); // needs to be done before setLastSeenState. Should be part of the method
          this.globState.setLastSeenState(snapshot.toDoLists);

          this.fiFo.popCur();
          this.requestInProgress = false;

          this.updateSubscribers(this.getState());
          this.sync();
        },
        (err) => {
          this.requestInProgress = false;
          this.log.error(`${err.status} - ${err.message}`);
          this.setSyncTimerIfNotHidden();
        }
      )
    ;
  }

  private setNewToDosFlags(beToDoLists: ToDoList[]) {
    const oldState = this.globState.copyLastSeenState();
    const toDoAddOperations = this.fiFo.getToDoAddOperations();
    toDoAddOperations.forEach(operation => operation.apply(oldState));

    beToDoLists.forEach(beList => {
      const matchingFeList = oldState.toDoLists.filter(feList => feList.id === beList.id)[0];
      if (matchingFeList) {
        beList.hasNewToDos = matchingFeList.hasNewToDos || this.feListMissesToDosInBeList(matchingFeList, beList);
      }
    });
  }

  private feListMissesToDosInBeList(feList: ToDoList, beList: ToDoList) {
    const beToDosNotInFeList = beList.toDos.filter(beToDo => !feList.toDos.map(toDo => toDo.id).includes(beToDo.id));
    return beToDosNotInFeList.length !== 0;
  }

  private updateSubscribers(state: ToDoList[]) {
    this.globStateSubject.next(state);
  }

  private setSyncTimerIfNotHidden() {
    if (!document.hidden) { // necessary, because response may arrive while ui is hidden
      this.syncTimer.start(() => this.sync());
    }
  }

  public getState(): ToDoList[] {
    const curState = this.globState.copyLastSeenState();
    this.fiFo.forEach(operation => operation.apply(curState));
    this.orderState.apply(curState);
    return curState.toDoLists;
  }

  public subscribe(callback: (toDoLists: ToDoList[]) => void): Subscription {
    return this.globStateSubject.subscribe(callback);
  }

  public memorizeOrder(listId: string, toDoIdOrder: string[]) {
    this.orderState.memorizeOrder(listId, toDoIdOrder);
  }

  public prependToOrder(listId: string, toDoId: string) {
    this.orderState.prependToOrder(listId, toDoId);
  }

  setHasNewToDosFalse(listId: string) {
    this.globState.setHasNewToDosFalse(listId);
    this.updateSubscribers(this.getState());
  }
}
