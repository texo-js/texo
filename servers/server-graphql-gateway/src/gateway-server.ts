import Koa from 'koa';
import ApolloKoaModule from 'apollo-server-koa';
import ApolloGatewayModule from '@apollo/gateway';
import { Logger, Loggers } from '@texo/logging';
import { ServerMetadata, MetadataRouter, printWelcome, ServerType, createApolloLogger } from '@texo/server-common';

import { GatewayServerOptions } from './gateway-server-options';
import { ServiceModuleDefinition, ServiceBuilderFactory, ServiceDefinitions } from './services';
import ConfigurationSchema from './schemas/configuration';
import { DefaultAuthorizationMiddleware } from './middleware/authorization';
import { DefaultCorrelationIdMiddleware } from './middleware/correlation';
import { DefaultLoggingMiddleware } from './middleware/logging';

const { ApolloServer } = ApolloKoaModule;
const { ApolloGateway } = ApolloGatewayModule;


export class GatewayServer {

  #app: Koa;
  #metadata: ServerMetadata;
  #options: GatewayServerOptions
  #logger: Logger;

  constructor({ options, metadata, modules }: { options: GatewayServerOptions, metadata: ServerMetadata, modules: ServiceModuleDefinition[] }) {
    this.#logger = Loggers.namespace('texo');

    this.#options = options;
    this.#metadata = { ...metadata, serverType: ServerType.GATEWAY_SERVER, texoVersion: '%{{TEXO_VERSION}}'}

    this.#app = new Koa();

    this.initialiseMiddleware();
    this.initialiseServices();
    this.initialiseGateway(modules);

    printWelcome('Texo', this.#metadata);
  }

  public listen(config: { port: number }) : void {
    this.#app.listen(config.port);
  }

  private initialiseMiddleware(): void {
    const app = this.#app;
    const { authorizationAdaptor } = this.#options;

    const correlation = new DefaultCorrelationIdMiddleware();
    const logging = new DefaultLoggingMiddleware();
    const authorization = new DefaultAuthorizationMiddleware({ adaptor: authorizationAdaptor });

    app.use(correlation.track());
    app.use(logging.logging());
    app.use(authorization.authorize(this.#logger));
  }

  private initialiseServices() : void {
    const app = this.#app;

    const router = new MetadataRouter(this.#metadata);

    app.use(router.routes())
    app.use(router.allowedMethods());
  }

  private initialiseGateway(modules: ServiceModuleDefinition[]) : void {
    const app = this.#app;
    const { queryContextAdaptor } = this.#options;

    const configurationSchema = new ServiceDefinitions.Local('configuration', 'local://configuration', ConfigurationSchema);
    const builder = new ServiceBuilderFactory([ configurationSchema, ...modules ]);

    const gateway = new ApolloGateway({
      serviceList: builder.getServices(),
      buildService: builder.getBuilder()
    });

    const server = new ApolloServer({
      gateway,
      subscriptions: false,
      plugins: [
        createApolloLogger(this.#logger)
      ],
      context: queryContextAdaptor.builder()
    });

    server.applyMiddleware({ app });
  }
}
