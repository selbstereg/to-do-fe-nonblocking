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
  beforeEach(() => jest.clearAllMocks());

  it('should sync and invoke callback after successful request', done => {
    const synchronizer: Synchronizer = new Synchronizer(
      mockHttpClient as any,
      mockErrorHandler as any
    );

    const responseBody: StateSnapshot = {
      operationId: 'op-id',
      toDoLists: [{id: 'list-uuid', name: 'list'}]
    };

    mockHttpClient.post.mockReturnValue(of(responseBody));

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

    const responseBody1: StateSnapshot = {
      operationId: 'op-id-1',
      toDoLists: [{id: 'uuid-list-1', name: 'list-1'}, {id: 'uuid-list-2', name: 'list-2'}]
    };
    const responseBody2: StateSnapshot = {
      operationId: 'op-id-2',
      toDoLists: [{id: 'uuid-list-1', name: 'list-1'}, {id: 'uuid-list-2', name: 'list-2'}]
    };

    const responseProvider = jest.fn();
    responseProvider.mockReturnValueOnce(responseBody1);
    responseProvider.mockReturnValueOnce(responseBody2);

    mockHttpClient.post = jest.fn((_1, _2) => {
      return timer(50).pipe(map(_3 => {
        console.log('responseProvider: ', responseProvider);
        return responseProvider();
      }));
    });

    synchronizer.fetchToDoLists(
      new ToDoListsGet(
        (lists) => {
          expect(lists.length).toBe(1);
          expect(lists.map(l => l.name)).toContain('list-1');
        }
      )
    );

    synchronizer.fetchToDoLists(
      new ToDoListsGet(
        (lists) => {
          expect(lists.length).toBe(2);
          expect(lists.map(l => l.name)).toContain('list-1', 'list-2');
          expect(mockHttpClient.post.mock.calls.length).toBe(2);
          done();
        }
      )
    );
  });

  // should retry upon error
  // should process multiple
});
