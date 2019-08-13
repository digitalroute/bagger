/* eslint-disable @typescript-eslint/no-explicit-any */

function isObject(value: any): value is { [key: string]: any } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

type Entry = [string, any];

export function cleanObject<T extends { [key: string]: any }>(pollutedObject: T): { [key: string]: any } {
  const pollutedEntries = Object.entries(pollutedObject);
  const entries: Entry[] = pollutedEntries
    .filter(([, value]): boolean => value !== undefined)
    .map(([key, value]: Entry): Entry => [key, isObject(value) ? cleanObject(value) : value]);

  return entries.reduce(
    (cleanObject, [currentKey, currentValue]): { [key: string]: any } => {
      cleanObject[currentKey] = currentValue;
      return cleanObject;
    },
    {} as any
  );
}
