export function generateId(array: any[]): number {
  const lastArrayItemId = array.length > 0 ? array[array.length - 1].id : 0;
  return lastArrayItemId + 1;
}
