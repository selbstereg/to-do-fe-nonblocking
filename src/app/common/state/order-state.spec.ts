import {OrderState} from './order-state';
import {ToDoList} from './glob-state';
import {toDo, toDoList} from './test-utils';

describe('OrderState', () => {
  it('sorts toDos according to order', () => {
    // arrange
    const orderState = new OrderState();

    orderState.memorizeOrder('list1', ['todo3', 'todo1', 'todo2']);

    const toDoLists: ToDoList[] = [
      toDoList(
        'list1',
        toDo('todo1'),
        toDo('todo2'),
        toDo('todo3')
      )
    ];

    // act
    orderState.apply({toDoLists});

    // assert
    const sortedToDos = toDoLists[0].toDos;

    expect(sortedToDos[0].id).toBe('todo3');
    expect(sortedToDos[1].id).toBe('todo1');
    expect(sortedToDos[2].id).toBe('todo2');
    expect(sortedToDos.length).toBe(3);
  });

  it('appends toDos for which no order is defined at the end', () => {
    // arrange
    const orderState = new OrderState();

    orderState.memorizeOrder('list1', ['todo1', 'todo2']);

    const toDoLists: ToDoList[] = [
      toDoList(
        'list1',
        toDo('todoY'),
        toDo('todo2'),
        toDo('todoX'),
        toDo('todo1'),
        toDo('todoZ'),
      )
    ];

    // act
    orderState.apply({toDoLists});

    // assert
    const sortedToDos = toDoLists[0].toDos;

    expect(sortedToDos[0].id).toBe('todo1');
    expect(sortedToDos[1].id).toBe('todo2');
    expect(sortedToDos[2].id).toBe('todoY');
    expect(sortedToDos[3].id).toBe('todoX');
    expect(sortedToDos[4].id).toBe('todoZ');
    expect(sortedToDos.length).toBe(5);
  });

  it('ignores to-do ids which are present in the order but not in the actual to-do list', () => {
    // arrange
    const orderState = new OrderState();

    orderState.memorizeOrder('list1', ['todo1', 'todo2']);

    const toDoLists: ToDoList[] = [
      toDoList(
        'list1',
        toDo('todo1')
      )
    ];

    // act
    orderState.apply({toDoLists});

    // assert
    const sortedToDos = toDoLists[0].toDos;

    expect(sortedToDos[0].id).toBe('todo1');
    expect(sortedToDos.length).toBe(1);
  });


  it('sorts the lists according to list id', () => {
    // arrange
    const orderState = new OrderState();

    orderState.memorizeOrder('list1', ['todo1', 'todo2']);
    orderState.memorizeOrder('list2', ['todo4', 'todo3']);

    const toDoLists: ToDoList[] = [
      toDoList(
        'list1',
        toDo('todo2'),
        toDo('todo1')
      ),
      toDoList(
        'list2',
        toDo('todo3'),
        toDo('todo4')
      )
    ];

    // act
    orderState.apply({toDoLists});

    // assert
    const sortedToDosOfList1 = toDoLists[0].toDos;

    expect(sortedToDosOfList1[0].id).toBe('todo1');
    expect(sortedToDosOfList1[1].id).toBe('todo2');
    expect(sortedToDosOfList1.length).toBe(2);

    const sortedToDosOfList2 = toDoLists[1].toDos;

    expect(sortedToDosOfList2[0].id).toBe('todo4');
    expect(sortedToDosOfList2[1].id).toBe('todo3');
    expect(sortedToDosOfList2.length).toBe(2);
  });
});
