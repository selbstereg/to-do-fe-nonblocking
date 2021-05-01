import {NamedEntity} from './named-entity.model';

export interface StateSnapshot {
  operationId: string;
  toDoLists: NamedEntity[];
}
