import Koa from 'koa';
import ApolloKoaModule from 'apollo-server-koa';
import ApolloGatewayModule from '@apollo/gateway';
import { Logger, Loggers } from '@texo/logging';
import { ServerMetadata, MetadataRouter, printWelcome, ServerType, createApolloLogger } from '@texo/server-common';

import { GatewayServerOptions } from './gateway-server-options';
import { ServiceModuleDefinition, ServiceBuilderFactory, ServiceDefinitions } from './services';
import ConfigurationSchema from './schemas/configuration';

const { ApolloServer } = ApolloKoaModule;
const { ApolloGateway } = ApolloGatewayModule;


export class GatewayServer {

  private app: Koa;
  private metadata: ServerMetadata;
  private options: GatewayServerOptions
  private logger: Logger;

  constructor({ options, metadata, modules }: { options: GatewayServerOptions, metadata: ServerMetadata, modules: ServiceModuleDefinition[] }) {
    this.logger = Loggers.createChild({ parent: Loggers.getSystem(), namespace: 'texo' });

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

  private initialiseGateway(modules: ServiceModuleDefinition[]) : void {
    const configurationSchema = new ServiceDefinitions.Local('configuration', 'local://configuration', ConfigurationSchema);
    const app = this.app;
    const builder = new ServiceBuilderFactory([ configurationSchema, ...modules ]);

    const gateway = new ApolloGateway({
      serviceList: builder.getServices(),
      buildService: builder.getBuilder()
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
}
