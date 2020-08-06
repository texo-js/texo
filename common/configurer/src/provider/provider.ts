export type Provider<R> = () => R;
export type ProviderWithOptions<R, O> = (options: O) => R;
export type ProviderTypes<R, O = never> = Provider<R> | ProviderWithOptions<R, O>;