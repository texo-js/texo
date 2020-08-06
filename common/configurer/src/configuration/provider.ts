import { ProviderPlaceholder } from "../placeholders";
import { ProviderTypes } from '../provider';

export function provider<T extends ProviderTypes<any, any>>(provider: T): ProviderPlaceholder<T> {
  return new ProviderPlaceholder(provider);
}