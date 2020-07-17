import { OptionsDescriptor } from '../options';
import { Placeholder, LiteralPlaceholder } from '../placeholders';
import { BatchProcessor } from '../batch-processor';
import { placeholderBatchExecutor } from './placeholder-batch-executor';
import { ChildObjectPlaceholder } from '../placeholders/child-object-placeholder';

const batch = new BatchProcessor(placeholderBatchExecutor);

export async function configure<T>(descriptor: OptionsDescriptor<T>) : Promise<T> {
  const signals: Promise<void>[] = [];
  const result: Record<string, any> = {};

  configureObject<T>(descriptor, result, signals);

  await Promise.all(signals);
  
  return result as unknown as T;
}

function configureObject<T>(descriptor: OptionsDescriptor<T>, result: Record<string, any>, signals: Promise<void>[]) : void {
  Object.entries(descriptor).forEach(([key, value]) => {
    const placeholder: Placeholder<any> = (value instanceof Placeholder) ? value : derivePlaceholder(value, signals);

    if (!placeholder) {
      throw new Error(`No action could be created for key '${key}' with value '${value}'.`);
    }

    signals.push(batch.enqueue(placeholder).then(value => result[key] = value));
  });
}

function derivePlaceholder(value: any, signals: Promise<void>[]): Placeholder<any> {
  switch (typeof value) {
    case 'function':
      // Provider?
      throw new Error('Not implemented');

    case 'object':
      // Duck-type setting?

      const child: Record<string, any> = {};
      configureObject(value, child, signals);
      return new ChildObjectPlaceholder(child)

    default: // Assume this should be treated as a literal
      return new LiteralPlaceholder(value);
  }
}