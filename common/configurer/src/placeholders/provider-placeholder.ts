import { Placeholder } from './placeholder';
import { OptionsDescriptor } from '../options';
import { Provider, ProviderWithOptions, ProviderTypes } from '../provider';
import { ExecutionContext } from '../resolvers/execution-context';

type ProvidedType<T> = T extends Provider<infer R> ? R : T extends ProviderWithOptions<infer R, any> ? R : never;
type OptionsType<T> = T extends ProviderWithOptions<any, infer O> ? O : never;

export class ProviderPlaceholder<T extends ProviderTypes<any, any>> extends Placeholder<ProvidedType<T>> {
  #provider: T;
  #options?: OptionsDescriptor<OptionsType<T>>;

  constructor(provider: T) {
    super();
    this.#provider = provider;
  }

  withOptions(options: OptionsDescriptor<OptionsType<T>>): ProviderPlaceholder<T> {
    this.#options = options;
    return this;
  }

  execute(context: ExecutionContext): Promise<ProvidedType<T>> {
    if (this.#options) {
      return context.resolveObject(this.#options).then(options => this.#provider(options));
    }

    return Promise.resolve(this.#provider(undefined));
  }
}

