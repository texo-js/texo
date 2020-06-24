import { ConfigurationOptions, ConfigurationOption, ValueType, DemandType } from '@texo/configurer';

export const DefaultConfigurationOptions: ConfigurationOptions = {
  a: {
    type: ValueType.PATH,
    demand: DemandType.REQUIRED,
    envName: 's'
  }
}