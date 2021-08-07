
export default function deepCopy<T>(objectToCopy: T): T {
  return JSON.parse(JSON.stringify(objectToCopy));
}
