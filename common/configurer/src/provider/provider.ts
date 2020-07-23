export interface Provider<R> {
  provide(): R;
}

export interface ConfigurableProvider<R, O> {
  provide(options: O): R;
}
