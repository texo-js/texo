import { Placeholder, SettingPlaceholder } from "../placeholders";
import { Setting } from "../settings";

export function setting<T>(setting: Setting<T>): Placeholder<T> {
  return new SettingPlaceholder<T>(setting);
}