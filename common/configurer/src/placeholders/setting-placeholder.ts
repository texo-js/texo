import { Placeholder } from "./placeholder";
import { Setting } from "../settings";

export class SettingPlaceholder<T> extends Placeholder<T> {
  #descriptor: Setting<T>;

  constructor(descriptor: Setting<T>) {
    super();
    this.#descriptor = descriptor;
  }

  get value(): Setting<T> {
    return this.#descriptor;
  }  
}