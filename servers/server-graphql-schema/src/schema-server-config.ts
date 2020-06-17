import { GraphQLSchemaModule } from 'apollo-graphql';
import { NamespacedLogger } from '@texo/logging'

export interface SchemaServerConfig {
  applicationName: string;
  applicationVersion: string;
  schemaModules: GraphQLSchemaModule[];
  logger: NamespacedLogger;
}


