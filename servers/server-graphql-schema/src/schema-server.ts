import Koa from 'koa';
import apollo from 'apollo-server-koa';
import apolloFederation from '@apollo/federation';
import graphql, { GraphQLSchema } from 'graphql';
import stringify from 'fast-json-stable-stringify';
import { createHash } from 'crypto';

import { ServerMetadata, MetadataRouter, printWelcome, ServerType, logger, setLogger, createApolloLogger } from '@texo/server-common';

import { SchemaServerOptions } from './schema-server-options';
import { NamespacedLogger } from '@texo/logging';
import { GraphQLSchemaModule } from '.';

const { ApolloServer } = apollo;
const { buildFederatedSchema } = apolloFederation;
const { introspectionFromSchema } = graphql;

export class SchemaServer {

  private app: Koa;
  private metadata: ServerMetadata;
  private options: SchemaServerOptions;

  constructor({ options, metadata, modules, rootLogger }: { options: SchemaServerOptions, metadata: ServerMetadata, modules: GraphQLSchemaModule[], rootLogger?: NamespacedLogger }) {
    setLogger((rootLogger || logger).ns('TEXO'));

    this.options = options;
    this.metadata = { ...metadata, serverType: ServerType.SCHEMA_SERVER, texoVersion: '%{{TEXO_VERSION}}' };

    this.app = new Koa();  
    this.initialiseServices();
    const { hash } = this.initialiseSchema(modules);

    metadata['SCHEMA_HASH'] = hash;

    printWelcome('Texo', this.metadata);
  }

  public listen(config: { port: number }) : void {
    this.app.listen(config.port);
  }


  private initialiseServices() : void {
    const router = new MetadataRouter(this.metadata);

    this.app.use(router.routes())
    this.app.use(router.allowedMethods());
  }

  private initialiseSchema(modules: GraphQLSchemaModule[]) : { hash: string } {
    const app = this.app;

    const schema = buildFederatedSchema(modules);
    const hash = this.hashSchema(schema);

    const server = new ApolloServer({
      schema,
      plugins: [
        createApolloLogger(logger)
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