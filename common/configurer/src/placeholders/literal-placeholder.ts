import { Placeholder } from './placeholder';

export class LiteralPlaceholder<T> extends Placeholder<T> {
  #value: T;

  constructor(value: T) {
    super();
    this.#value = value;
  }

  get value(): T {
    return this.#value
  }
}