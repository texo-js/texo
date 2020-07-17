import { string } from "yargs";
import { BatchProcessor, Item } from './batch-processor';

describe('', () => {
  it('works', async () => {
    const executor = (items: Item<string, string>[]) => { items.forEach(item => item.resolve(`DONE: ${item.value}`)) };

    const processor = new BatchProcessor<string, string>(executor);

    const outputs: Record<string, string> = {};

    const hello = processor.enqueue('hello').then(result => outputs['hello'] = result);
    const goodbye = processor.enqueue('goodbye').then(result => outputs['goodbye'] = result);

    await Promise.all([ hello, goodbye ]);

    expect(outputs['hello']).toEqual('DONE: hello');
    expect(outputs['goodbye']).toEqual('DONE: goodbye');
  });
})