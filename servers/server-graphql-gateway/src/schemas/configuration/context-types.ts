import gql from 'graphql-tag';

export default gql`
  extend type Query {
    configuration: Configuration!
  }

  type Configuration {
    modules: [Module]!
    entryPoint: EntryPoint!
  }

  type Module {
    name: String!
    version: String!
  }

  type EntryPoint {
    module: String!
    component: String!
  }
`;
