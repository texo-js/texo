import { ProviderPlaceholder } from "../placeholders";
import { Provider, ConfigurableProvider } from '../provider';

export function provider<T extends Provider<any> | ConfigurableProvider<any, any>>(provider: T): ProviderPlaceholder<T> {
  return new ProviderPlaceholder(provider);
}