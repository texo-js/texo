import { Placeholder } from './placeholder';
import { ExecutionContext } from '../resolvers/execution-context';

export class LiteralPlaceholder<T> extends Placeholder<T> {
  #value: T;

  constructor(value: T) {
    super();
    this.#value = value;
  }

  execute(context: ExecutionContext): Promise<T> {
    return Promise.resolve(this.#value);
  }
}