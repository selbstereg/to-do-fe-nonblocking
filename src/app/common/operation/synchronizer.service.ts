import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SYNC_INTERVAL_MS, TO_DO_LISTS_ENDPOINT_URL} from '../constants';
import {ErrorHandler} from '../error/error-handler.service';
import {catchError, take} from 'rxjs/operators';
import {StateSnapshot} from '../../to-do-list-page/model/state-snapshot';
import {DebounceTimer} from '../utils/debounce-timer';
import {Operation, OperationType} from './operation';
import {ToDoListsGet} from '../../to-do-list-page/model/to-do-list.model';
import {FiFo} from './fifo';
import {throwError} from 'rxjs';

@Injectable()
export class Synchronizer {
  private debounceTimer: DebounceTimer = new DebounceTimer(SYNC_INTERVAL_MS);
  private fiFo: FiFo<Operation<any>> = new FiFo();

  constructor(
    private httpClient: HttpClient,
    private errorHandler: ErrorHandler
  ) {
  }

  private sync() {
    this.debounceTimer.stop();
    console.log('sync()');
    if (this.fiFo.isNotEmpty()) {
      console.log('fiFo.isNotEmpty');
      const operation = this.fiFo.peekCur();
      if (operation.operationType === OperationType.TO_DO_LISTS_GET) {
        this.issueRequest(operation);
      } else {
        throw new Error('unknown operation type: ' + operation.operationType);
      }
    } else {
      this.syncAgainAfterInterval();
    }
  }

  private issueRequest(operation: Operation<any>) {
    this.httpClient
      .post(TO_DO_LISTS_ENDPOINT_URL, operation)
      .pipe(
        catchError(err => {
          this.errorHandler.display(err);
          this.syncAgainAfterInterval();
          return throwError(err);
        }),
        take(1) // TODO Paul Bauknecht 01 05 2021: Error handling: In case of error call syncAgainAfterInterval
      )
      .subscribe((snapshot: StateSnapshot) => {
        console.log('success! Got State: ', snapshot);
        this.fiFo.popCur();
        this.sync();
        operation.callback(snapshot.toDoLists);
      });
  }

  private syncAgainAfterInterval() {
    console.log('syncAgainAfterInterval');
    this.debounceTimer.start(() => this.sync());
  }


  // READ
  public fetchToDoLists(toDoListsGet: ToDoListsGet) {
    this.fiFo.add(toDoListsGet);
    this.sync();
  }
}
