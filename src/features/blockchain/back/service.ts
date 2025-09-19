import { interpret } from '@bemedev/app-solid';
import { machine } from './machine.machine';

export const createService = () =>
  interpret(machine, { context: { internetStatus: true } });
