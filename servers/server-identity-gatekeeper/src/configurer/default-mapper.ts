import { ConfigurationMapper } from '@texo/configurer';
import { IdentityGatekeeperServerOptions } from '../identity-gatekeeper-server-options';

export class DefaultConfigurationMapper implements ConfigurationMapper<IdentityGatekeeperServerOptions> {
 
  map(options: Record<string, string | number | boolean>): IdentityGatekeeperServerOptions {
    throw new Error("Method not implemented.");
  }
  
}