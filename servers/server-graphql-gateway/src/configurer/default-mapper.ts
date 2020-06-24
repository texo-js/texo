import { ConfigurationMapper, ConfigurationError } from '@texo/configurer';
import { GatewayServerOptions } from '../gateway-server-options';

export class DefaultMapper implements ConfigurationMapper<GatewayServerOptions> {

  map(options: Record<string, string | number | boolean>): GatewayServerOptions {
    const config: GatewayServerOptions = {
      name: 'blank'
    };

    return config;
  }

}