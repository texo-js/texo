export * from './gateway-server';
export * from './gateway-server-options';
export * from './services';
export * from './configuration';

export { GraphQLSchemaModule } from 'apollo-graphql';

import apollo from 'apollo-server-koa';
export const { gql } = apollo;