import {Synchronizer} from './synchronizer.service';
import {ToDoListsGet} from '../../to-do-list-page/model/to-do-list.model';
import {Observable, of, throwError, timer} from 'rxjs';
import {StateSnapshot} from '../../to-do-list-page/model/state-snapshot';
import {mergeMap} from 'rxjs/operators';
import DebounceTimer from '../utils/debounce-timer';

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

const mockErrorHandler = {
  display: jest.fn()
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

function crResponseBody(listNames: string[]): StateSnapshot {
  return {
    operationId: 'op-id-1',
    toDoLists: listNames.map(listName => {
      return {id: 'uuid-' + listName, name: listName};
    })
  };
}

let synchronizer: Synchronizer;

describe('Synchronizer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    synchronizer = new Synchronizer(
      mockHttpClient as any,
      mockErrorHandler as any
    );
  });

  it('should sync and invoke callback after successful request', done => {
    mockHttpClient.post.mockReturnValue(of(crResponseBody(['list'])));

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
      of(crResponseBody(['list-1'])),
      of(crResponseBody(['list-1', 'list-2']))
    );

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

  it('should retry on error', done => {
    mockServerResponse(
      throwError('my error'),
      of(crResponseBody(['list']))
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
          expect(mockErrorHandler.display.mock.calls.length).toBe(1);
          expect(mockErrorHandler.display.mock.calls[0][0]).toBe('my error');
          done();
        }
      )
    );
  });
});
