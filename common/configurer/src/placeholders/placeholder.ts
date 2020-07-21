import { ExecutionContext } from "../resolvers/execution-context";

export abstract class Placeholder<T> {
  abstract execute(context: ExecutionContext): Promise<T>;
}