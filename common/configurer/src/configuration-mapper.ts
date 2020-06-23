export interface ConfigurationMapper<TConfiguration> {
  map(options: Record<string, string | number | boolean>) : TConfiguration
}