import { OptionsDescriptor, setting, Demand } from '@texo/configurer';

import { GatewayServerOptions } from '../gateway-server-options';
import { ValueType } from '@texo/configurer/lib/settings/value-type';

export const DefaultOptions: OptionsDescriptor<GatewayServerOptions> = {
  accessTokenJwksUrl: setting({ type: ValueType.STRING, demand: Demand.REQUIRED, parameter: 'access-token-jwks-url', environment: 'TEXO_ACCESS_TOKEN_JWKS_URL' })
};
