import Koa from 'koa';
import { Loggers } from '@texo/logging';

export interface LoggingMiddleware {
  logging(): Koa.Middleware
}

export class DefaultLoggingMiddleware implements LoggingMiddleware {
  logging(): Koa.Middleware {
    const logger = Loggers.namespace('texo/koa');

    return async (ctx: Koa.Context, next: Koa.Next) => {
      const metadata = {
        correlationId: ctx.state.correlationId,
        request: {
          method: ctx.request.method,
          url: ctx.request.url
        }
      };

      logger.info('http request started', metadata);

      try {
        await next();
      } catch (e) {
        logger.error(e, metadata);
      } finally {
        logger.info('http request complete', metadata);
      }
    }
  }
}