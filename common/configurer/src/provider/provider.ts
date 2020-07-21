export interface Provider<R, O> {
  provide(options: O): R;
}