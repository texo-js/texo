import { Placeholder } from './placeholder';
import { ExecutionContext } from '../resolvers';
import { OptionsDescriptor } from '../options';



export type Constructable<T> = new () => T;
export type ConstructableWithOptions<T, O> = new (options: O) => T;

export type ConstructableType<T> = T extends Constructable<infer R> ? R : T extends ConstructableWithOptions<infer R, any> ? R : never;
export type ConstructableOptions<T> = T extends ConstructableWithOptions<any, infer O> ? O : never;

export class ConstructPlaceholder<T extends Constructable<any> | ConstructableWithOptions<any, any>> extends Placeholder<ConstructableType<T>> {
  #ctor: T;
  #options: OptionsDescriptor<ConstructableOptions<T>> | undefined;

  constructor(ctor: T) {
    super();
    this.#ctor = ctor;
  }

  withOptions(options: OptionsDescriptor<ConstructableOptions<T>>) {
    this.#options = options;
    return this;
  }

  execute(context: ExecutionContext): Promise<ConstructableType<T>> {
    if (this.#options) {
      return context.resolveObject(this.#options).then(options => new this.#ctor(options));
    }

    return Promise.resolve(new this.#ctor(undefined));
  }
}