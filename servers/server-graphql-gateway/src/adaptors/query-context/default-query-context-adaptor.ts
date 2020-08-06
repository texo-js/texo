import * as Apollo from 'apollo-server-koa';
import { Logger, Loggers } from '@texo/logging';

import { GatewayContext } from './gateway-context';
import { QueryContextAdaptor, ContextBuilder, ContextArguments } from './query-context-adaptor';

const { AuthenticationError } = Apollo;

export interface DefaultQueryContextAdaptorOptions { }

export class DefaultQueryContextAdaptor implements QueryContextAdaptor {
  #logger: Logger;

  constructor(options: DefaultQueryContextAdaptorOptions) {
    this.#logger = Loggers.createChild({ parent: Loggers.getSystem(), namespace: 'texo' });
  }

  builder(): ContextBuilder {
    return async (args: ContextArguments): Promise<GatewayContext> => {
      const { ctx } = args;

      try {
        const user = ctx.state.user;
        if (!user) {
          throw new AuthenticationError('missing or invalid user credentials');
        }

        return {
          correlationId: ctx.state.correlationId,
          user: ctx.state.user
        };
      } catch (e) {
        this.#logger.error('Error building query context', e.message);
        throw e;
      }
    };
  }
}
