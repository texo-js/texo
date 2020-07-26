import ApolloGatewayModule from '@apollo/gateway';
import ApolloFederationModule from '@apollo/federation';
import { GraphQLResponse, GraphQLRequestContext } from 'apollo-server-types';

import { LocalServiceDefinition } from "./local-service-definition";

const { LocalGraphQLDataSource } = ApolloGatewayModule;
const { buildFederatedSchema } = ApolloFederationModule;

class LocalService extends LocalGraphQLDataSource {
  constructor(definition: LocalServiceDefinition) {
    super(buildFederatedSchema(definition.schema));
  }

  process({ request, context, }: GraphQLRequestContext<Record<string, any>>): Promise<GraphQLResponse> {
    // TODO: Logging
    return super.process({ request, context });
  }
}

export { LocalService, LocalGraphQLDataSource };