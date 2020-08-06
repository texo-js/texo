import Koa from 'koa';

import { GatewayContext } from './gateway-context';

export type ContextArguments = { ctx: Koa.Context };
export type ContextBuilder = (args: ContextArguments) => Promise<GatewayContext>;

export interface QueryContextAdaptor {
  builder(): ContextBuilder;
}