import { Placeholder, LiteralPlaceholder } from "../placeholders";

export function literal<T>(value: T): Placeholder<T> {
  return new LiteralPlaceholder<T>(value);
}