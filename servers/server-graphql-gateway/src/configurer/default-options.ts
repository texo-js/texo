import { ConfigurationOptions, ValueType, DemandType } from '@texo/configurer';

export const options: ConfigurationOptions = {
  accessTokenPublicKeys: {
    type: ValueType.PATH,
    demand: DemandType.REQUIRED,
    argName: 'access-token-public-keys',
    envName: 'TEXO_ACCESS_TOKEN_PUBLIC_KEYS'
  },

  accessTokenPrivateKey: {
    type: ValueType.PATH,
    demand: DemandType.REQUIRED,
    argName: 'access-token-private-key',
    envName: 'TEXO_ACCESS_TOKEN_PRIVATE_KEY'
  },

  refreshTokenPublicKeys: {
    type: ValueType.PATH,
    demand: DemandType.REQUIRED,
    argName: 'refresh-token-public-keys',
    envName: 'TEXO_REFESH_TOKEN_PUBLIC_KEYS'
  },

  refreshTokenPrivateKey: {
    type: ValueType.PATH,
    demand: DemandType.REQUIRED,
    argName: 'refresh-token-private-key',
    envName: 'TEXO_REFRESH_TOKEN_PRIVATE_KEY'
  }
};