import { ConstructPlaceholder, Constructable, ConstructableWithOptions } from "../placeholders";


export function construct<T extends Constructable<any> | ConstructableWithOptions<any, any>>(ctor: T): ConstructPlaceholder<T> {
  return new ConstructPlaceholder(ctor);
}