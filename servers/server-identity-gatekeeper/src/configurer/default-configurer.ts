import { buildConfiguration } from '@texo/configurer';

import { DefaultConfigurationOptions } from './default-options';
import { DefaultConfigurationMapper } from './default-mapper';
import { IdentityGatekeeperServerOptions } from '../identity-gatekeeper-server-options';

export async function getOptions() : Promise<IdentityGatekeeperServerOptions> {
  return buildConfiguration(DefaultConfigurationOptions, new DefaultConfigurationMapper());
}