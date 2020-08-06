import { OptionsDescriptor, setting, Demand, construct, provider, Provider, ProviderWithOptions, literal } from '@texo/configurer';

import { GatewayServerOptions } from '../gateway-server-options';
import { ValueType } from '@texo/configurer';
import { DefaultQueryContextAdaptor } from '../adaptors/query-context/default-query-context-adaptor';
import { TokenAuthorizationAdaptor } from '../adaptors/authorization';

export const DefaultOptions: OptionsDescriptor<GatewayServerOptions> = {

  authorizationAdaptor: construct(TokenAuthorizationAdaptor).withOptions({
    authCookieName: setting({
      demand: Demand.REQUIRED,
      type: ValueType.STRING,
      parameter: 'auth-cookie-name',
      environment: 'TEXO_AUTH_COOKIE_NAME',
      default: 'authorization'
    }),

    accessTokenJwksUrl: setting({
      demand: Demand.REQUIRED,
      type: ValueType.STRING,
      parameter: 'access-token-key-url',
      environment: 'TEXO_ACCESS_TOKEN_KEY_URL'
    }),

    issuer: literal('not set yet!'),
    audience: literal('not set yet!')
  }),

  gatewayTokenKeys: {
    publicKeysFile: setting({
      type: ValueType.STRING,
      demand: Demand.REQUIRED,
      parameter: 'gateway-token-public-keys',
      environment: 'TEXO_GATEWAY_TOKEN_PUBLIC_KEYS'
    }),

    privateKeyFile: setting({
      type: ValueType.STRING,
      demand: Demand.REQUIRED,
      parameter: 'gateway-token-private-key',
      environment: 'TEXO_GATEWAY_TOKEN_PRIVATE_KEY'
    })
  },

  queryContextAdaptor: construct(DefaultQueryContextAdaptor)
};
