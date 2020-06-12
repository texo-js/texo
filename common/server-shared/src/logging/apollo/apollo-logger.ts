import { ApolloServerPlugin, GraphQLRequestContext, GraphQLServiceContext } from 'apollo-server-plugin-base';
import { NamespacedLogger } from '@texo/logging'
import { v4 as uuid } from 'uuid';

export const APOLLO_NAMESPACE = 'APOLLO';

export function createApolloLogger(parentLogger: NamespacedLogger) : ApolloServerPlugin {
  const logger = parentLogger.ns(APOLLO_NAMESPACE);

  return {
    serverWillStart(service: GraphQLServiceContext) {
      logger.info('starting Apollo Server', { schemaHash: service.schemaHash });
    },

    requestDidStart(ctx: GraphQLRequestContext) {
      const correlationId = uuid();
      const metadata = {
        correlationId,
        operation: {
          name: ctx.request.operationName
        }
      };

      logger.info('request started', metadata);
      logger.profile('request');

      return {
        parsingDidStart: (ctx: GraphQLRequestContext) => {
          logger.debug('parsing started', metadata);
          logger.profile('parsing');

          return (err?: Error) => {
            logger.profile('parsing', { ...metadata, message: 'parsing complete', level: 'debug' });
          }
        },

        validationDidStart: (ctx: GraphQLRequestContext) => {
          logger.debug('validation started', metadata);
          logger.profile('validation');

          return (errs?: readonly Error[]) => {
            logger.profile('validation', { ...metadata, message: 'validation complete', level: 'debug' });
          }
        },

        didResolveOperation: (ctx: GraphQLRequestContext) => {
          logger.debug('operation resolved', metadata);
        },

        responseForOperation: (ctx: GraphQLRequestContext) => {
          return null;
        },

        executionDidStart: (ctx: GraphQLRequestContext) => {
          logger.debug('execution started', metadata);
          logger.profile('execution');

          return (err?: Error) => {
            logger.profile('execution', { ...metadata, message: 'execution complete', level: 'debug' });
          }
        },

        willSendResponse: (ctx: GraphQLRequestContext) => {
          logger.profile('request', { ...metadata, message: 'request complete', level: 'debug' });
        },

        didEncounterErrors: (ctx: GraphQLRequestContext) => {
          logger.info('errors encountered', metadata);
        }
      }
    }
  }
}