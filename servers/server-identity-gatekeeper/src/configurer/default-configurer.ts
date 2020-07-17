import { configure } from '@texo/configurer';

import { DefaultOptions } from './default-options';
import { IdentityGatekeeperOptions } from '../identity-gatekeeper-options';
import { Loggers, getSystemLogger } from '@texo/server-common';

export async function configurer() : Promise<IdentityGatekeeperOptions> {
  const logger = Loggers.createChild({ parent: getSystemLogger(), namespace: 'configurer' });
  
  try {
    return await configure(DefaultOptions);
  }
  catch (e) {
    logger.error(e);
    throw e;
  }
}