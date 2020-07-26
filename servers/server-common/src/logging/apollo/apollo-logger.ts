import { ApolloServerPlugin, GraphQLRequestContext, GraphQLServiceContext } from 'apollo-server-plugin-base';
import { Logger, Loggers } from '@texo/logging'
import { v4 as uuid } from 'uuid';

export const APOLLO_NAMESPACE = 'apollo';

function profile() {
  const start = Date.now();

  return () => {
    return Date.now() - start;
  }
}

export function createApolloLogger(parentLogger: Logger) : ApolloServerPlugin {
  const logger = Loggers.createChild({ parent: parentLogger, namespace: APOLLO_NAMESPACE });

  return {
    serverWillStart(service: GraphQLServiceContext) {
      logger.info('starting apollo server', { schemaHash: service.schemaHash });
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
      const requestProfile = profile();

      return {
        parsingDidStart: (ctx: GraphQLRequestContext) => {
          logger.debug('parsing started', metadata);
          const parsingProfile = profile();

          return (err?: Error) => {
            logger.debug('parsing complete', { ...metadata, duration: parsingProfile() });
          }
        },

        validationDidStart: (ctx: GraphQLRequestContext) => {
          logger.debug('validation started', metadata);
          const validationProfile = profile();

          return (errs?: readonly Error[]) => {
            logger.debug('validation complete', { ...metadata, duration: validationProfile() });
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
          const executionProfile = profile();

          return (err?: Error) => {
            logger.debug('execution complete', { ...metadata, duration: executionProfile() });
          }
        },

        willSendResponse: (ctx: GraphQLRequestContext) => {
          logger.info('request complete', { ...metadata, duration: requestProfile() } );
        },

        didEncounterErrors: (ctx: GraphQLRequestContext) => {
          logger.error('errors encountered', metadata);
        }
      }
    }
  }
}