import Koa from 'koa';
import apollo from 'apollo-server-koa';
import apolloGateway, { GraphQLDataSource } from '@apollo/gateway';
import apolloFederation from '@apollo/federation';
import { GraphQLRequest, WithRequired, GraphQLResponse, GraphQLRequestContext } from 'apollo-server-types';
import { Logger, Loggers } from '@texo/logging';
import { ServerMetadata, MetadataRouter, printWelcome, ServerType, createApolloLogger } from '@texo/server-common';

import { GatewayServerOptions } from './gateway-server-options';
import { GraphQLSchema } from 'graphql';
import { IGraphQLModuleDefinition, IHttpGraphQLModuleDefinition, GraphQLModuleDefinitionType, ILocalGraphQLModuleDefinition, LocalGraphQLModuleDefinition } from './graphql-modules';
import { URL } from 'url';
import configurationSchema from './schemas/configuration';

const { ApolloServer } = apollo;
const { ApolloGateway, RemoteGraphQLDataSource, LocalGraphQLDataSource } = apolloGateway;
const { buildFederatedSchema } = apolloFederation;

export class GatewayServer {

  private app: Koa;
  private metadata: ServerMetadata;
  private options: GatewayServerOptions
  private logger: Logger;

  constructor({ options, metadata, modules }: { options: GatewayServerOptions, metadata: ServerMetadata, modules: IGraphQLModuleDefinition[] }) {
    this.logger = Loggers.createChild({ parent: Loggers.getSystem(), namespace: 'TEXO' });

    this.options = options;
    this.metadata = { ...metadata, serverType: ServerType.GATEWAY_SERVER, texoVersion: '%{{TEXO_VERSION}}'}

    this.app = new Koa();
    this.initialiseServices();
    this.initialiseGateway(modules);

    printWelcome('Texo', this.metadata);
  }

  public listen(config: { port: number }) : void {
    this.app.listen(config.port);
  }

  private initialiseServices() : void {
    const app = this.app;

    const router = new MetadataRouter(this.metadata);

    app.use(router.routes())
    app.use(router.allowedMethods());
  }

  private initialiseGateway(modules: IGraphQLModuleDefinition[]) : void {
    const app = this.app;
    const serviceList: Record<string, ServiceDefinition> = this.buildServiceList(modules);

    const gateway = new ApolloGateway({
      serviceList: Object.values(serviceList),
      buildService: ({ name, url }) => this.buildService({ name, url: url! })
    });

    const server = new ApolloServer({
      gateway,
      subscriptions: false,
      plugins: [
        createApolloLogger(this.logger)
      ]
    });

    server.applyMiddleware({ app });
  }

  private buildServiceList(modules: IGraphQLModuleDefinition[]): Record<string, ServiceDefinition> {
    const services: Record<string, ServiceDefinition> = {
      me: this.getLocalServiceDefinition(new LocalGraphQLModuleDefinition('configuration', configurationSchema))
    };

    modules.forEach(module => {
      switch (module.type) {
        case GraphQLModuleDefinitionType.LOCAL:
          services[module.name] = this.getLocalServiceDefinition(module as ILocalGraphQLModuleDefinition);
        case GraphQLModuleDefinitionType.HTTP:
          services[module.name] = this.getHttpServiceDefinition(module as IHttpGraphQLModuleDefinition);
      }
    });
    
    return services
  }

  private buildService({ name, url, schema }: ServiceDefinition) : GraphQLDataSource {
    const parsedUrl = new URL(url);

    switch (parsedUrl.protocol) {
      case 'local:':
        return new ContextualisedLocalDataSource(name, schema!);

      case 'http:':
      case 'https:':
        return new ContextualisedHttpDataSource(name, { url });

      default:
        throw new Error(`Unsupported GraphQLDataSource protocol: ${parsedUrl.protocol}`);
    }
  }

  private getHttpServiceDefinition({ name, url }: IHttpGraphQLModuleDefinition) : ServiceDefinition {
    return { name, url }
  }

  private getLocalServiceDefinition({ name, schema }: ILocalGraphQLModuleDefinition): ServiceDefinition {
    const federatedSchema = buildFederatedSchema(schema);
    return { name, url: `local://${name}`, schema: federatedSchema }
  }
}

class ContextualisedHttpDataSource extends RemoteGraphQLDataSource {
    constructor(name: string, config: { url: string, apq?: boolean }) {
      super(config)
    }

    async willSendRequest({ request, context } : { request: RemoteGraphQLDataRequest, context: Record<string, any>}) {
      request.http.headers.set('user-id', context.userId);
    }

    async didReceiveResponse({ response, request, context }: { response: GraphQLResponse, request: GraphQLRequest, context: Record<string, any> }) : Promise<GraphQLResponse> {
      return response;
    }
}

class ContextualisedLocalDataSource extends LocalGraphQLDataSource {
  constructor(name: string, schema: GraphQLSchema) {
    super(buildFederatedSchema(configurationSchema));
  }

  process({ request, context, }: Pick<GraphQLRequestContext<Record<string, any>>, "request" | "context">): Promise<GraphQLResponse> {
    // TODO: Logging
    return super.process({ request, context });
  }
}

interface ServiceDefinition {
  name: string;
  url: string;
  schema?: GraphQLSchema;
}

type RemoteGraphQLDataRequest = WithRequired<GraphQLRequest, 'http'>;