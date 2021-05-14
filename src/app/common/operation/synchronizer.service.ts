import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SYNC_INTERVAL_MS, TO_DO_LISTS_ENDPOINT_URL} from '../constants';
import {take} from 'rxjs/operators';
import DebounceTimer from '../utils/debounce-timer';
import {Operation, OperationType} from './operation';
import {ToDoListsGet} from '../../to-do-list-page/model/to-do-list.model';
import {FiFo} from './fifo';
import {LoggingService} from '../logging/logging.service';
import {GlobState, StateSnapshot, ToDoList} from './glob-state.service';

@Injectable()
export class Synchronizer {
  private requestInProgress = false;
  private syncTimer: DebounceTimer = new DebounceTimer(SYNC_INTERVAL_MS);
  private fiFo: FiFo<Operation> = new FiFo();

  constructor(
    private httpClient: HttpClient,
    private log: LoggingService,
    private globState: GlobState
  ) {
  }

  private sync() {
    this.syncTimer.stop();
    if (this.fiFo.isNotEmpty() && !this.requestInProgress) {
      const operation = this.fiFo.peekCur();
      if (operation.operationType === OperationType.TO_DO_LISTS_GET) {
        this.issueRequest(operation);
      } else {
        throw new Error('unknown operation type: ' + operation.operationType);
      }
    } else {
      // TODO Paul Bauknecht 02 05 2021: Nützt das überhaupt was? Wenn was in den FiFo gepusht wird wird ja eh auch sync() aufgerufen.
      this.syncAgainAfterInterval();
    }
  }

  private issueRequest(operation: Operation) {
    this.requestInProgress = true;
    this.httpClient
      .post(TO_DO_LISTS_ENDPOINT_URL, operation)
      .pipe(take(1))
      .subscribe(
        (snapshot: StateSnapshot) => {
          this.fiFo.popCur();
          this.requestInProgress = false;
          this.sync();
          console.log('snapshot: ', snapshot);
          this.globState.setLastSeenState(snapshot.toDoLists);
          this.triggerCallback(operation.callback);
        },
        (err) => {
          this.requestInProgress = false;
          this.log.error(`${err.status} - ${err.message}`);
          this.syncAgainAfterInterval();
        }
      )
    ;
  }

  private syncAgainAfterInterval() {
    this.syncTimer.start(() => this.sync());
  }


  // READ
  public fetchToDoLists(toDoListsGet: ToDoListsGet) {
    this.fiFo.add(toDoListsGet);
    this.sync();
    this.triggerCallback(toDoListsGet.callback);
  }


  private triggerCallback(callback: (toDoLists: ToDoList[]) => void) {
    const curState = this.globState.copyLastSeenState();
    this.fiFo.forEach(operation =>
      operation.apply(curState)
    );
    callback(curState.toDoLists);
  }
}
