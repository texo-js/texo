import Koa from 'koa';

import { AuthorizationMiddleware } from './authorization-middleware';
import { AuthorizationAdaptor } from '../../adaptors/authorization';
import { AuthorizationError } from '../../adaptors/authorization/authorization-error';
import { Logger } from '@texo/logging';


export interface DefaultAuthorizationOptions {
  adaptor: AuthorizationAdaptor;
}

export class DefaultAuthorizationMiddleware implements AuthorizationMiddleware {
  #adaptor: AuthorizationAdaptor;

  constructor(options: DefaultAuthorizationOptions) {
    this.#adaptor = options.adaptor;
  }

  authorize(logger: Logger): Koa.Middleware {
    return async (ctx: Koa.Context, next: Koa.Next) => {
      try {
        ctx.state.user = await this.#adaptor.authorize(ctx);
      } catch (e) {
        delete ctx.state.user;
        
        if (e instanceof AuthorizationError) {
          logger.error(e);
        } else {
          throw e;
        }
      }

      await next();
    }
  }
}