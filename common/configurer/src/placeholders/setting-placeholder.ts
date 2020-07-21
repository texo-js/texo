import { Placeholder } from "./placeholder";
import { Setting } from "../settings";
import { ExecutionContext } from "../resolvers/execution-context";

export class SettingPlaceholder<T> extends Placeholder<T> {
  #descriptor: Setting<T>;

  constructor(descriptor: Setting<T>) {
    super();
    this.#descriptor = descriptor;
  }

  execute(context: ExecutionContext): Promise<T> {
    return context.resolveSetting(this.#descriptor);
  }
}