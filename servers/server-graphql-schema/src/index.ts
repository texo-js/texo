export * from './schema-server';
export * from './schema-server-config';

export { GraphQLSchemaModule } from 'apollo-graphql';

import apollo from 'apollo-server-koa';
export const { gql } = apollo;