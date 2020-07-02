import { ConfigurationMapper, ConfigurationError } from '@texo/configurer';

import { GatewayServerOptions } from '../gateway-server-options';
import { OptionKeys } from './constants';

export class DefaultMapper implements ConfigurationMapper<GatewayServerOptions> {

  map(options: Record<string, string | number | boolean>): GatewayServerOptions {
    const config: GatewayServerOptions = {
      accessTokenJwksUrl: options[OptionKeys.ACCESS_TOKEN_JWKS_URL] as string
    };

    return config;
  }
}