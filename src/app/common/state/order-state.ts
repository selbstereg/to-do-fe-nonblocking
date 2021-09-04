import {Injectable} from '@angular/core';
import {GlobStateMutation, ToDoLists} from './glob-state';
import deepCopy from '../utils/deep-copy';
import {OrderStorageService} from './order-storage.service';

// TODO Paul Bauknecht 07 08 2021: should be part of globState or globState should be renamed
@Injectable()
export class OrderState implements GlobStateMutation {
  // the value (type string[]) is an array of the to-do ids
  private listIdToItemOrderMap = new Map<string, string[]>();

  constructor(private storage: OrderStorageService) {
    if (storage.listIdToItemOrderMap) {
      this.listIdToItemOrderMap = storage.listIdToItemOrderMap;
    }
  }

  public memorizeOrder(listId: string, toDoIdOrder: string[]) {
    this.listIdToItemOrderMap.set(listId, toDoIdOrder);
    this.onStateChange();
  }

  public prependToOrder(listId: string, toDoId: string) {
    this.listIdToItemOrderMap.get(listId).unshift(toDoId);
    this.onStateChange();
  }

  public apply(globListState: ToDoLists) {
    this.putToDosIntoOrder(globListState);
    this.listIdToItemOrderMap.clear();
    this.memorizeOrderOfAllLists(globListState);
    this.onStateChange();
  }

  private onStateChange() {
    this.storage.saveOrderState(this.listIdToItemOrderMap);
  }

  private putToDosIntoOrder(globListState: ToDoLists) {
    globListState.toDoLists.forEach(toDoList => {
      const order = this.listIdToItemOrderMap.get(toDoList.id);

      if (order) {
        let copiedToDos = deepCopy(toDoList.toDos);

        const orderedToDos = order
          .map(currentToDoId => {
            const currentToDo = copiedToDos.find(toDo => toDo.id === currentToDoId);
            if (currentToDo) {
              copiedToDos = copiedToDos.filter(toDo => toDo.id !== currentToDoId);
              return currentToDo;
            }
            return null;
          })
          .filter(toDo => toDo); // filter out null values

        // copiedToDos now contains only the leftover to-dos which were not considered in the order
        toDoList.toDos = orderedToDos.concat(copiedToDos);
      }
    });
  }

  private memorizeOrderOfAllLists(globListState: ToDoLists) {
    globListState.toDoLists.forEach(toDoList => {
      this.listIdToItemOrderMap.set(
        toDoList.id,
        toDoList.toDos.map(toDo => toDo.id)
      );
    });
  }
}
