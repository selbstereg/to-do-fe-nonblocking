export enum OperationType {
  TO_DO_LISTS_GET
}

export interface Operation<T> {
  operationType: OperationType;
  operationId: string; // Needed, so BE can decide, if it already processed the operation.
  callback: (arg: T) => void;
}
