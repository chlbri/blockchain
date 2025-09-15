import { uniqueArray } from '#globals/back/helpers';

export const displayNumberS = (num?: string, replacer = '.') => {
  if (!num) return '';
  const len = num.length;

  let result = '';
  for (let i = 0; i < len; i++) {
    result += num[i];
    const check = (len - i - 1) % 3 === 0 && i < len - 1;
    if (check) result += replacer;
  }

  return result;
};

export const retrieveNumberS = (str?: string, ...replacers: string[]) => {
  if (!str) return '';
  const _replacers = uniqueArray(...replacers, '.');
  return _replacers.reduce((s, r) => s.replaceAll(r, ''), str);
};

retrieveNumberS.number = (str?: string, ...replacers: string[]) => {
  const numStr = retrieveNumberS(str, ...replacers);
  return Number(numStr);
};
