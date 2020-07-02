import { ConfigurationOptions, ConfigurationOption, ValueType, DemandType } from '@texo/configurer';

export const DefaultConfigurationOptions: ConfigurationOptions = {
  accessTokenPublicJWKS: {
    type: ValueType.PATH,
    demand: DemandType.REQUIRED,
    envName: 'ACCESS_TOKEN_PUBLIC_JWKS'
  },

  accessTokenPrivateJWK: {
    type: ValueType.PATH,
    demand: DemandType.REQUIRED,
    envName: 'ACCESS_TOKEN_PRIVATE_JWK'
  },

  refreshTokenPublicJWKS: {
    type: ValueType.PATH,
    demand: DemandType.REQUIRED,
    envName: 'REFRESH_TOKEN_PUBLIC_JWKS'
  },

  refreshTokenPrivateJWK: {
    type: ValueType.PATH,
    demand: DemandType.REQUIRED,
    envName: 'REFRESH_TOKEN_PRIVATE_JWK'
  }
}