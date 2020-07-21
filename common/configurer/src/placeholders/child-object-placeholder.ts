import { Placeholder } from './placeholder';
import { ExecutionContext } from '../resolvers';
import { OptionsDescriptor } from '../options';

export class ChildObjectPlaceholder<T> extends Placeholder<T> {
  #value: OptionsDescriptor<T>;

  constructor(descriptor: OptionsDescriptor<T>) {
    super();
    this.#value = descriptor;
  }

  execute(context: ExecutionContext): Promise<T> {
    return context.resolveObject(this.#value);
  }
}