export class Profiler {
  #start: number;

  constructor() {
    this.#start = Date.now();
  }

  duration(): number {
    return Date.now() - this.#start;
  }
}

export function profiler() {
  return new Profiler();
}