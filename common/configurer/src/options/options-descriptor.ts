import { Setting } from "../settings";
import { Placeholder } from "../placeholders";


type OptionType<T> = T | Setting<T> | OptionsDescriptor<T>;
type OptionDescriptor<T> = OptionType<T> | Placeholder<T>;

export type OptionsDescriptor<T> = {
  [P in keyof T]: OptionDescriptor<T[P]>;
};