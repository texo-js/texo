import ApolloGatewayModule from '@apollo/gateway';
import { WithRequired, GraphQLRequest, GraphQLResponse } from 'apollo-server-types';
import { HttpServiceDefinition } from "./http-service-definition";

const { RemoteGraphQLDataSource } = ApolloGatewayModule;

type RemoteGraphQLDataRequest = WithRequired<GraphQLRequest, 'http'>;

class HttpService extends RemoteGraphQLDataSource {
  constructor(definition: HttpServiceDefinition) {
    super({ url: definition.url.href, apq: true });
  }

  async willSendRequest({ request, context } : { request: RemoteGraphQLDataRequest, context: Record<string, any>}) {
    request.http.headers.set('user-id', context.userId);
  }

  async didReceiveResponse({ response, request, context }: { response: GraphQLResponse, request: GraphQLRequest, context: Record<string, any> }) : Promise<GraphQLResponse> {
    return response;
  }
}

export { HttpService, RemoteGraphQLDataSource }