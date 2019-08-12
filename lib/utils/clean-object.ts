function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function cleanObject<T extends { [key: string]: any }>(pollutedObject: T): { [key: string]: any } {
  const pollutedEntries = Object.entries(pollutedObject);
  const entries: [string, any][] = pollutedEntries
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]: [string, any]) => [key, isObject(value) ? cleanObject(value) : value]);

  return entries.reduce(
    (cleanObject, [currentKey, currentValue]) => {
      cleanObject[currentKey] = currentValue;
      return cleanObject;
    },
    {} as { [key: string]: any }
  );
}
