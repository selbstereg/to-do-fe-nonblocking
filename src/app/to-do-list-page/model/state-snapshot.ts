import {NamedEntity} from './to-do-list.model';

export interface StateSnapshot {
  operationId: string;
  toDoLists: NamedEntity[];
}
