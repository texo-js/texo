import dotenv from 'dotenv';

import { OptionsDescriptor } from '../options';
import { ExecutionContext } from '../resolvers';

export async function configure<T>(options: OptionsDescriptor<T>) : Promise<T> {
  dotenv.config();
  
  const context = new ExecutionContext();
  return context.resolveObject<T>(options);
}
