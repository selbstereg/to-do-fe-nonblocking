import {Synchronizer} from './synchronizer.service';
import {ToDoListsGet} from '../../to-do-list-page/model/to-do-list.model';
import {of, timer} from 'rxjs';
import {StateSnapshot} from '../../to-do-list-page/model/state-snapshot';
import {map} from 'rxjs/operators';

// Mock uuid/v4 because it otherwise leads to type errors
jest.mock('uuid/v4', () => { // TODO Paul Bauknecht 02 05 2021: maybe move this into a __mocks__ folder beneath node_modules
  let count = 0;
  return {
    default: () => {
      const key = `test-uuid-${count}`;
      count++;
      return key;
    }
  };
});

jest.mock('../constants');

const mockHttpClient = {
  post: jest.fn() // code depends on httpClient.post returning Observable<Object>
};

const mockErrorHandler = jest.fn();

describe('Synchronizer', () => {
  it('should sync and invoke callback after successful request', done => {
    const synchronizer: Synchronizer = new Synchronizer(
      mockHttpClient as any,
      mockErrorHandler as any
    );

    const retVal: StateSnapshot = {
      operationId: 'op-id',
      toDoLists: [{id: 'list-uuid', name: 'list'}]
    };

    mockHttpClient.post = jest.fn((url, body) => {
      return of(retVal);
    });

    synchronizer.fetchToDoLists(
      new ToDoListsGet(
        (lists) => {
          console.log(lists);
          done();
        }
      )
    );
  });

  it('should sync multiple operations', done => {
    const synchronizer: Synchronizer = new Synchronizer(
      mockHttpClient as any,
      mockErrorHandler as any
    );

    const retVal: StateSnapshot = {
      operationId: 'op-id',
      toDoLists: [{id: 'list-uuid', name: 'list'}]
    };

    mockHttpClient.post = jest.fn((url, body) => {
      return timer(50).pipe(map(_ => retVal));
    });

    synchronizer.fetchToDoLists(
      new ToDoListsGet(
        (lists) => {
          console.log('first return: ', lists);
        }
      )
    );

    synchronizer.fetchToDoLists(
      new ToDoListsGet(
        (lists) => {
          console.log('second return: ', lists);
          done();
        }
      )
    );
  });

  // should retry upon error
  // should process multiple
});
