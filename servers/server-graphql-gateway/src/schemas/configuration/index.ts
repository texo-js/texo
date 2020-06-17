import { GraphQLSchemaModule } from 'apollo-graphql';
import typeDefs from './context-types';
import resolvers from './context-resolvers';

const module: GraphQLSchemaModule = {
  typeDefs,
  resolvers
};

export default module;