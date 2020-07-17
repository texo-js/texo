import parser from 'yargs-parser';

import { Item } from "../batch-processor";
import { Setting } from "../settings";
import { resolveSettings } from '../setting-resolver';

export function settingBatchExecutor(items: Item<Setting<any>, any>[]) {

  const values = resolveSettings(items.map(item => item.value));
  
  for (let i = 0; i < items.length; i++) {
    const value = values[i];
    const item = items[i];

    item.resolve(value);
  }
}

