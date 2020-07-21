import { ProviderPlaceholder } from "../placeholders";
import { Provider } from '../provider';

export function provider<T extends Provider<any, any>>(provider: T): ProviderPlaceholder<T> {
  return new ProviderPlaceholder(provider);
}