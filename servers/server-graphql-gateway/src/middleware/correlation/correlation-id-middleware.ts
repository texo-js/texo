import Koa from 'koa';
import { v4 as uuid } from 'uuid';

export interface CorrelationIdMiddleware {
  track(): Koa.Middleware;
}

export class DefaultCorrelationIdMiddleware implements CorrelationIdMiddleware {
  track(): Koa.Middleware {
    return async (ctx: Koa.Context, next: Koa.Next) => {
      ctx.state.correlationId = `TEXO-${uuid()}`;

      await next();
    }
  }
}