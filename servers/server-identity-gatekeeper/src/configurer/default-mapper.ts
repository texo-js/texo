import { ConfigurationMapper } from '@texo/configurer';
import { IdentityGatekeeperServerOptions } from '../identity-gatekeeper-server-options';

export class DefaultConfigurationMapper implements ConfigurationMapper<IdentityGatekeeperServerOptions> {
  map(options: Record<string, string | number | boolean>): IdentityGatekeeperServerOptions {
    return {
      accessTokenKeys: {
        publicKeysFile: options.accessTokenPublicJWKS as string,
        privateKeyFile: options.accessTokenPrivateJWK as string
      },

      refreshTokenKeys: {
        publicKeysFile: options.refreshTokenPublicJWKS as string,
        privateKeyFile: options.refreshTokenPrivateJWK as string
      }
    }
  }  
}