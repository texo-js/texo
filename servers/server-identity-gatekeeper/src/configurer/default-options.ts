import { OptionsDescriptor, setting, Demand, ValueType } from '@texo/configurer';
import { IdentityGatekeeperOptions } from '../identity-gatekeeper-options';


export const DefaultOptions: OptionsDescriptor<IdentityGatekeeperOptions> = {
  accessTokenKeys: {
    publicKeysFile: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, environment: 'TEXO_ACCESS_TOKEN_PUBLIC_JWKS' }),
    privateKeyFile: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, environment: 'TEXO_ACCESS_TOKEN_PRIVATE_JWK' })
  },

  refreshTokenKeys: {
    publicKeysFile: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, environment: 'TEXO_REFRESH_TOKEN_PUBLIC_JWKS' }),
    privateKeyFile: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, environment: 'TEXO_REFRESH_TOKEN_PRIVATE_JWK' })
  }
}