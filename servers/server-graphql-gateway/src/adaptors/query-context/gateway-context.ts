import { GatewayUser } from '../../gateway-user';

export interface GatewayContext extends Record<string, any> {
  user: GatewayUser;
  correlationId: string;
}