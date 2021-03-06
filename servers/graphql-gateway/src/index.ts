export * from './gateway-server';
export * from './gateway-server-config';
export * from './graphql-modules';

export { GraphQLSchemaModule } from 'apollo-graphql';

import apollo from 'apollo-server-koa';
export const { gql } = apollo;