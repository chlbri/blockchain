import { interpret } from '@bemedev/app-solid';
import { machine } from './-machine.machine';

const service = () => interpret(machine);

export { machine, service };
