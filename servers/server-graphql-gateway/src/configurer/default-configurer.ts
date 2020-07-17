import { configure } from '@texo/configurer';
import { getSystemLogger } from '@texo/server-common';
import { Loggers } from '@texo/logging';

import { DefaultOptions } from './default-options';
import { GatewayServerOptions } from '../gateway-server-options';

export async function configurer() : Promise<GatewayServerOptions> {
  const logger = Loggers.createChild({ parent: getSystemLogger(), namespace: 'configurer' });
  
  try {
    return await configure(DefaultOptions);
  }
  catch (e) {
    logger.error(e);
    throw e;
  }
}