import Koa from 'koa';
import apollo from 'apollo-server-koa';
import apolloFederation from '@apollo/federation';
import graphql, { GraphQLSchema } from 'graphql';
import stringify from 'fast-json-stable-stringify';
import { createHash } from 'crypto';

import { ServerMetadata, MetadataRouter, printWelcome, ServerType, logger, setLogger, createApolloLogger } from '@texo/server-common';

import { SchemaServerConfig } from './schema-server-config';

const { ApolloServer } = apollo;
const { buildFederatedSchema } = apolloFederation;
const { introspectionFromSchema } = graphql;

export class SchemaServer {

  private app: Koa;
  private metadata: ServerMetadata;

  constructor(config: SchemaServerConfig) {
    setLogger(config.logger.ns('TEXO'));

    const app = new Koa(); 

    const metadata: ServerMetadata = {
      applicationName: config.applicationName,
      applicationVersion: config.applicationVersion,
      serverType: ServerType.SCHEMA_SERVER,
      texoVersion: '%{TEXO_VERSION}',
      attributes: []
    } 

    this.initialiseServices(app, metadata);
    const { hash } = this.initialiseSchema(app, config, metadata);

    metadata.attributes.push({ name: 'SCHEMA_HASH', value: hash });

    this.app = app;
    this.metadata = metadata;

    printWelcome('Texo', metadata);
  }

  public listen(config: { port: number }) : void {
    this.app.listen(config.port);
  }


  private initialiseServices(app: Koa, metadata: ServerMetadata) : void {
    const router = new MetadataRouter(metadata);

    app.use(router.routes())
    app.use(router.allowedMethods());
  }

  private initialiseSchema(app: Koa, config: SchemaServerConfig, metadata: ServerMetadata ) : { hash: string } {
    const schema = buildFederatedSchema(config.schemaModules);
    const hash = this.hashSchema(schema);

    const server = new ApolloServer({
      schema,
      plugins: [
        createApolloLogger(logger!)
      ]
    });

    server.applyMiddleware({ app });

    return { hash };
  }

  private hashSchema(schema: GraphQLSchema) : string {
    const introspection = introspectionFromSchema(schema);
    const serialisedSchema = stringify(introspection.__schema);

    const hash = createHash('sha256')
      .update(serialisedSchema)
      .digest('hex');

    return hash;
  }
}