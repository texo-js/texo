import { Item, BatchProcessor } from "../batch-processor";
import { Placeholder, LiteralPlaceholder, SettingPlaceholder } from "../placeholders";
import { settingBatchExecutor } from "./setting-batch-executor";
import { ConfigurationError } from "..";
import { ChildObjectPlaceholder } from "../placeholders/child-object-placeholder";

const batch = new BatchProcessor(settingBatchExecutor);

export function placeholderBatchExecutor(items: Item<Placeholder<any>, any>[]) {
  items.forEach(item => {
    const resolver = item.value;

    if (resolver instanceof LiteralPlaceholder) {
      item.resolve(resolver.value);
      return;
    }

    if (resolver instanceof SettingPlaceholder) {
      batch.enqueue(resolver.value).then(result => {
        item.resolve(result);
      });      
      return;
    }

    if (resolver instanceof ChildObjectPlaceholder) {
      item.resolve(resolver.value);
      return;
    }

    throw new ConfigurationError('Unknown plaeholder type...');
  });
}