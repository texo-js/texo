import { SettingResolver, ObjectResolver } from ".";
import { Setting } from "../settings";
import { OptionsDescriptor } from "../options";

export class ExecutionContext {
  #settingResolver: SettingResolver;
  #objectResolver: ObjectResolver;

  constructor() {
    this.#settingResolver = new SettingResolver();
    this.#objectResolver = new ObjectResolver();
  }

  resolveSetting<T>(setting: Setting<T>): Promise<T> {
    return this.#settingResolver.resolve(setting)
  }

  resolveObject<T>(descriptor: OptionsDescriptor<T>): Promise<T> {
    return this.#objectResolver.resolve(descriptor, this);
  }
}