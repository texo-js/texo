import { Placeholder } from './placeholder';

export class ChildObjectPlaceholder<T extends Record<string, any>> extends Placeholder<T> {
  #value: T;

  constructor(value: T) {
    super();
    this.#value = value;
  }

  get value(): T {
    return this.#value
  }
}