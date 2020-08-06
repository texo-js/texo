import Koa from 'koa';

import { GatewayUser } from '../../gateway-user';

export interface AuthorizationAdaptor {
  authorize(ctx: Koa.Context): Promise<GatewayUser>;
}