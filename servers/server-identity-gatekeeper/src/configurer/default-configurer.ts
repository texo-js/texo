import { configure } from '@texo/configurer';

import { DefaultOptions } from './default-options';
import { IdentityGatekeeperOptions } from '../identity-gatekeeper-options';
import { Loggers } from '@texo/logging';

export async function configurer() : Promise<IdentityGatekeeperOptions> {
  const logger = Loggers.createChild({ parent: Loggers.getSystem(), namespace: 'configurer' });
  
  try {
    return await configure(DefaultOptions);
  }
  catch (e) {
    logger.error(e);
    throw e;
  }
}