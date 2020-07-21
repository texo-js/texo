import { OptionsDescriptor } from "../options";
import { ExecutionContext } from "./execution-context";
import { Placeholder, LiteralPlaceholder, ChildObjectPlaceholder } from "../placeholders";

export class ObjectResolver {
  resolve<T>(descriptor: OptionsDescriptor<T>, context: ExecutionContext): Promise<T> {
    const output: Record<string, any> = {};
    const tasks: Promise<any>[] = [];

    Object.entries(descriptor).forEach(([ key, value ]) => {
      const placeholder: Placeholder<any> | undefined = (value instanceof Placeholder) ? value : this.derivePlaceholder(value, context);
      if (!placeholder) {
        throw new Error('No placeholder!');
      }

      const task = placeholder.execute(context).then(result => output[key] = result);
      tasks.push(task);
    });

    return Promise.all(tasks).then(() => output as T);
  }

  private derivePlaceholder(value: any, context: ExecutionContext): Placeholder<any> {
    switch (typeof value) {
      case 'function':
        // Provider?
        throw new Error('Not implemented');
  
      case 'object':
        // Duck-type setting?
        return new ChildObjectPlaceholder(value);
  
      default: // Assume this should be treated as a literal
        return new LiteralPlaceholder(value);
    }
  }
}