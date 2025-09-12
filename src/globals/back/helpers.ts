export const uniqueArray = <T>(...arr: T[]): T[] => {
  return Array.from(new Set(arr));
};
