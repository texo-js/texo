import { ConfigurationOptions, ValueType, DemandType } from '@texo/configurer';

import { OptionKeys } from './constants';

export const DefaultOptions: ConfigurationOptions = {
  [OptionKeys.ACCESS_TOKEN_JWKS_URL]: {
    type: ValueType.PATH,
    demand: DemandType.REQUIRED,
    argName: 'access-token-jwks-url',
    envName: 'TEXO_ACCESS_TOKEN_JWKS_URL'
  }
};
