import { interpret } from '@bemedev/app-solid';
import { machine } from './-machine.machine';

export const { start, select, send, context, addOptions, matches, stop } =
  interpret(machine);
