import { ApolloServerPlugin, GraphQLRequestContext, GraphQLServiceContext } from 'apollo-server-plugin-base';
import { Logger, Loggers, profiler } from '@texo/logging'

export const APOLLO_NAMESPACE = 'apollo';

export function createApolloLogger(parentLogger: Logger) : ApolloServerPlugin {
  const logger = Loggers.createChild({ parent: parentLogger, namespace: APOLLO_NAMESPACE });

  return {
    serverWillStart(service: GraphQLServiceContext) {
      logger.info('starting apollo server', { schemaHash: service.schemaHash });
    },

    requestDidStart(ctx: GraphQLRequestContext) {
      
      const correlationId = ctx.context.correlationId;
      const metadata = {
        correlationId,
        operation: {
          name: ctx.request.operationName
        }
      };

      logger.info('graphql request started', metadata);
      const requestProfile = profiler();

      return {
        parsingDidStart: (ctx: GraphQLRequestContext) => {
          logger.debug('parsing started', metadata);
          const parsingProfile = profiler();

          return (err?: Error) => {
            logger.debug('parsing complete', { ...metadata, duration: parsingProfile.duration() });
          }
        },

        validationDidStart: (ctx: GraphQLRequestContext) => {
          logger.debug('validation started', metadata);
          const validationProfile = profiler();

          return (errs?: readonly Error[]) => {
            logger.debug('validation complete', { ...metadata, duration: validationProfile.duration() });
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
          const executionProfile = profiler();

          return (err?: Error) => {
            logger.debug('execution complete', { ...metadata, duration: executionProfile.duration() });
          }
        },

        willSendResponse: (ctx: GraphQLRequestContext) => {
          logger.info('graphql request complete', { ...metadata, duration: requestProfile.duration() } );
        },

        didEncounterErrors: (ctx: GraphQLRequestContext) => {
          logger.error('graphql errors encountered', metadata);
        }
      }
    }
  }
}