export interface Item<TValue, TResult> {
  value: TValue,
  resolve(result: TResult): void;
  reject(reason?: any): void;
}

type ResolveFunction<T> = (value?: T | PromiseLike<T>) => void;
type RejectFunction = (reason?: any) => void;

class BatchItem<TValue, TResult> implements Item<TValue, TResult> {
  #value: TValue;
  #resolve: ResolveFunction<TResult>;
  #reject: RejectFunction;

  constructor(value: TValue, resolve: ResolveFunction<TResult>, reject: RejectFunction) {
    this.#value = value;
    this.#resolve = resolve;
    this.#reject = reject
  }

  get value(): TValue {
    return this.#value;
  }

  resolve(result: TResult) {
    this.#resolve(result);
  }

  reject(reason?: any) {
    this.#reject(reason);
  }
}

export class BatchProcessor<T, R> {
  #executor: (items: Item<T, R>[]) => void;
  #queue: Item<T, R>[];

  constructor(executor: (items: Item<T, R>[]) => void) {
    this.#queue = [];
    this.#executor = executor;
  }

  public enqueue(value: T) : Promise<R> {
    console.log(`Enqueuing: ${value}`);
    if (this.#queue.length == 0) {
      process.nextTick(() => this.executeBatch());
    }

    const promise = new Promise<R>((resolve, reject) => {
      this.#queue.push(new BatchItem<T, R>(value, resolve, reject));
    });

    return promise;
  }

  private executeBatch() {
    console.log(`Executing batch`);
    const batch = this.#queue;
    this.#queue = [];

    this.#executor(batch);
  }
}