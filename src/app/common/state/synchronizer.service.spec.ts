import {Synchronizer} from './synchronizer.service';
import {ToDoListsGet} from './operations/to-do-list-get';
import {Observable, of, throwError, timer} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {LoggingService} from '../logging/logging.service';
import {GlobState, StateSnapshot, ToDoList} from './glob-state.service';

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
// mock, because otherwise the sync loop may never stop
const mockStartTimer = jest.fn();
const mockStopTimer = jest.fn();
jest.mock('../utils/debounce-timer', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        start: mockStartTimer,
        stop: mockStopTimer
      };
    })
  };
});

const mockHttpClient = {
  post: jest.fn() // code depends on httpClient.post returning Observable<Object>
};

const mockLoggingService = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

function mockServerResponse(...responses: Observable<StateSnapshot>[]) {
  const responseProvider = jest.fn();
  responses.forEach(responseBody => responseProvider.mockReturnValueOnce(responseBody));

  mockHttpClient.post = jest.fn((_1, _2) => {
    return timer(50)
      .pipe(
        mergeMap(_ => responseProvider())
      );
  });
}

function createToDoLists(listNames: string[]): ToDoList[] {
  return listNames.map(listName => {
    return {id: 'uuid-' + listName, name: listName};
  });
}

function createResponseBody(listNames: string[]): StateSnapshot {
  return {
    operationId: 'op-id-1',
    toDoLists: createToDoLists(listNames)
  };
}

let synchronizer: Synchronizer;

describe('Synchronizer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    synchronizer = new Synchronizer(
      mockHttpClient as any as HttpClient,
      mockLoggingService as any as LoggingService,
      new GlobState()
    );
  });

  it('should sync and invoke callback after successful request', done => {
    mockHttpClient.post.mockReturnValue(of(createResponseBody(['list'])));

    synchronizer.fetchToDoLists(
      new ToDoListsGet(
        (lists) => {
          expect(lists.length).toBe(1);
          expect(lists.map(l => l.name)).toContain('list');
          done();
        }
      )
    );
  });

  it('should sync multiple operations', done => {
    mockServerResponse(
      of(createResponseBody(['list-1'])),
      of(createResponseBody(['list-1', 'list-2']))
    );

    // first fetch operation
    synchronizer.fetchToDoLists(
      new ToDoListsGet(
        (lists) => {
          expect(lists.length).toBe(1);
          expect(lists.map(l => l.name)).toContain('list-1');
        }
      )
    );

    // second fetch operation
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

  it('should retry on error', done => {
    mockServerResponse(
      throwError('my error'),
      of(createResponseBody(['list']))
    );

    // enable the timer
    mockStartTimer.mockImplementationOnce((callback) => {
      timer(50).subscribe(
        () => callback()
      );
    });

    synchronizer.fetchToDoLists(
      new ToDoListsGet(
        (lists) => {
          expect(lists.length).toBe(1);
          expect(lists.map(l => l.name)).toContain('list');
          done();
        }
      )
    );
  });
});
