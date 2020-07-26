import { configure as cfg } from '@texo/configurer';
import { Loggers } from '@texo/logging';

import { DefaultOptions } from './default-options';
import { GatewayServerOptions } from '../gateway-server-options';

export async function configure() : Promise<GatewayServerOptions> {
  const logger = Loggers.createChild({ parent: Loggers.getSystem(), namespace: 'configurer' });
  
  try {
    const configuration = await cfg(DefaultOptions);
    logger.debug('loaded configuration', { configuration });

    return configuration;
  }
  catch (e) {
    logger.error('error loading configuration', { error: e });
    throw e;
  }
}