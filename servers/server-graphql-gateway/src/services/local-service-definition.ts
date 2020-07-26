import { URL } from 'url';
import { GraphQLSchemaModule } from 'apollo-graphql';
import { ServiceDefinitionBase } from "./service-definition-base";

export class LocalServiceDefinition extends ServiceDefinitionBase {
  #schema: GraphQLSchemaModule;

  constructor(name: string, url: string | URL, schema: GraphQLSchemaModule) {
    super(name, url);
    this.#schema = schema;

    if (this.url.protocol !== 'local:') {
      throw new Error(`Local service URLs must have the 'local:' protocol.`);
    }
  }

  get schema(): GraphQLSchemaModule {
    return this.#schema;
  }
}
