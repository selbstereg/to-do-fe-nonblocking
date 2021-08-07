import {ToDo, ToDoList} from './glob-state';

export function toDoList(id: string, ...toDos: ToDo[]): ToDoList {
  return {
    id,
    name: '', // irrelevant
    toDos
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
