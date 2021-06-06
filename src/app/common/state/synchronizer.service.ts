import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL, SYNC_INTERVAL_MS} from '../constants';
import {take} from 'rxjs/operators';
import DebounceTimer from '../utils/debounce-timer';
import {Operation} from './operations/operation';
import {ToDoListsGet} from './operations/to-do-lists-get';
import {OperationFiFo} from './fifo';
import {LoggingService} from '../logging/logging.service';
import {GlobState, StateSnapshot, ToDoList} from './glob-state';
import {Subject, Subscription} from 'rxjs';

@Injectable()
export class Synchronizer {
  private requestInProgress = false;
  private syncTimer: DebounceTimer = new DebounceTimer(SYNC_INTERVAL_MS);

  private globStateSubject = new Subject<ToDoList[]>();

  constructor(
    private httpClient: HttpClient,
    private log: LoggingService,
    private globState: GlobState,
    private fiFo: OperationFiFo
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


  public addOperation(operation: Operation) {
    this.fiFo.add(operation);
    this.globStateSubject.next(this.getState());
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
          this.fiFo.popCur();
          this.requestInProgress = false;
          this.sync();
          this.globState.setLastSeenState(snapshot.toDoLists);
          this.triggerCallback(operation.callback);
        },
        (err) => {
          this.requestInProgress = false;
          this.log.error(`${err.status} - ${err.message}`);
          this.setSyncTimerIfNotHidden();
        }
      )
    ;
  }

  private setSyncTimerIfNotHidden() {
    if (!document.hidden) { // necessary, because response may arrive while ui is hidden
      this.syncTimer.start(() => this.sync());
    }
  }

  private triggerCallback(callback: (toDoLists: ToDoList[]) => void) {
    callback(this.getState());
  }

  public getState(): ToDoList[] {
    const curState = this.globState.copyLastSeenState();
    this.fiFo.forEach(operation => operation.apply(curState));
    return curState.toDoLists;
  }

  public subscribe(callback: (toDoLists: ToDoList[]) => void): Subscription {
    return this.globStateSubject.subscribe(callback);
  }
}
