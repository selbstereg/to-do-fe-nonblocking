import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SYNC_INTERVAL_MS, TO_DO_LISTS_ENDPOINT_URL} from '../constants';
import {take} from 'rxjs/operators';
import {StateSnapshot} from '../../to-do-list-page/model/state-snapshot';
import DebounceTimer from '../utils/debounce-timer';
import {Operation, OperationType} from './operation';
import {ToDoListsGet} from '../../to-do-list-page/model/to-do-list.model';
import {FiFo} from './fifo';
import {LoggingService} from '../logging/logging.service';

@Injectable()
export class Synchronizer {
  private requestInProgress = false;
  private debounceTimer: DebounceTimer = new DebounceTimer(SYNC_INTERVAL_MS);
  private fiFo: FiFo<Operation<any>> = new FiFo();

  constructor(
    private httpClient: HttpClient,
    private log: LoggingService
  ) {
  }

  private sync() {
    this.debounceTimer.stop();
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

  private issueRequest(operation: Operation<any>) {
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
          operation.callback(snapshot.toDoLists);
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
    this.debounceTimer.start(() => this.sync());
  }


  // READ
  public fetchToDoLists(toDoListsGet: ToDoListsGet) {
    this.fiFo.add(toDoListsGet);
    this.sync();
  }
}
