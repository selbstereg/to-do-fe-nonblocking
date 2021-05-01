import {timer, Subscription} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TO_DO_LISTS_ENDPOINT_URL} from '../constants';
import {Observable} from 'rxjs';
import {SpinnerOverlayService} from './spinner-overlay.service';
import {NamedEntity} from 'src/app/to-do-list-page/model/named-entity.model';
import {ErrorHandler} from './error-handler.service';
import {take} from 'rxjs/operators';
import {StateSnapshot} from '../../to-do-list-page/model/state-snapshot';


export enum OperationType {
  TO_DO_LISTS_GET
}

export interface Operation<T> {
  operationType: OperationType;
  operationId: string;
  callback: (arg: T) => void;
}

export class ToDoListsGet implements Operation<NamedEntity[]> {
  public operationType = OperationType.TO_DO_LISTS_GET; // TODO Paul Bauknecht 01 05 2021: iS THIS NEEDED?

  constructor(
    public callback: (toDoLists: NamedEntity[]) => void,
    public operationId: string
  ) {
  }
}

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

const SYNC_INTERVAL_MS = 5000;

@Injectable()
export class CrudClient {

  private isSyncing = false;
  private fiFo: FiFo<Operation<any>> = new FiFo();

  constructor(
    private httpClient: HttpClient,
    private spinnerOverlayService: SpinnerOverlayService,
    private errorHandler: ErrorHandler
  ) {
  }


  public startSync() {
    this.sync();
    this.isSyncing = true;
  }

  private async sync() {
    console.log('sync()');
    if (this.fiFo.isNotEmpty()) {
      console.log('fiFo.isNotEmpty');
      const operation = this.fiFo.peekCur();
      if (operation.operationType === OperationType.TO_DO_LISTS_GET) {
        console.log('issuing post request');
        this.httpClient
          .post(TO_DO_LISTS_ENDPOINT_URL, operation)
          .pipe(
            take(1) // TODO Paul Bauknecht 01 05 2021: Error handling: In case of error call syncAgainAfterInterval
          )
          .subscribe((snapshot: StateSnapshot) => {
            console.log('success! Got State: ', snapshot);
            this.fiFo.popCur(); // TODO Paul Bauknecht 01 05 2021: We don't need the operationId here. Maybe remove it?
            this.sync();
            operation.callback(snapshot.toDoLists);
          });
      } else {
        throw new Error('unknown operation type: ' + operation.operationType);
      }
    } else {
      this.syncAgainAfterInterval();
    }
  }

  public syncAgainAfterInterval() {
    console.log('syncAgainAfterInterval');
    timer(SYNC_INTERVAL_MS).subscribe(
      () => this.sync()
    );
  }


  // READ
  public fetchToDoLists(toDoListsGet: ToDoListsGet) {
    this.fiFo.add(toDoListsGet);
  }

  //
  // CREATE
  // public addToDoList(listName: string): Observable<NamedEntity> {
  //   const request = () => this.httpClient.post(TO_DO_LISTS_ENDPOINT_URL, listName);
  //
  //   return this.sendRequest(request) as Observable<NamedEntity>;
  // }
  //
  //   // DELETE
  //   public deleteToDoList(toDoListId: number): Observable<NamedEntity> {
  //       const url = `${TO_DO_LISTS_ENDPOINT_URL}${toDoListId}`;
  //       const request = () => this.httpClient.delete(url);
  //
  //       return this.sendRequest(request) as Observable<NamedEntity>;
  //   }

  // private functions
  // private sendRequest(request: () => Observable<Object>) {
  //     const jobId: number = this.startSpinner();
  //
  //     return request().pipe(
  //         catchError(err => {
  //             this.stopSpinner(jobId);
  //             this.errorHandler.display(err);
  //             return throwError(err);
  //         }),
  //         take(1),
  //         tap(_ => this.stopSpinner(jobId))
  //     );
  // }
  //
  // private stopSpinner = (jobId: number) => this.spinnerOverlayService.stop(jobId);
  // private startSpinner = () => this.spinnerOverlayService.start();

}
