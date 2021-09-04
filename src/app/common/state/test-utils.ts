import {ToDo, ToDoList} from './to-do-list-state/glob-state';

export function toDoList(id: string, ...toDos: ToDo[]): ToDoList {
  return {
    id,
    name: '', // irrelevant
    toDos,
    hasNewToDos: false
  };
}

export function toDo(
  id: string,
  name = '',
  details = ''
): ToDo {
  return {
    id,
    name,
    details
  };
}
