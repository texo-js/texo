import { GraphQLSchema } from "graphql";
import { GraphQLSchemaModule } from "apollo-graphql";

export enum GraphQLModuleDefinitionType {
  LOCAL = 'local',
  HTTP = 'http'
}

export interface IGraphQLModuleDefinition {
  name: string;
  type: GraphQLModuleDefinitionType
} 

export interface IHttpGraphQLModuleDefinition extends IGraphQLModuleDefinition {
  type: GraphQLModuleDefinitionType.HTTP;
  url: string;
}

export class HttpGraphQLModuleDefinition implements IHttpGraphQLModuleDefinition {
  private _name: string;
  private _url: string;

  constructor(name: string, options: { url: string }) {
    this._name = name;
    this._url = options.url;
  }

  public get name() : string {
    return this._name
  }

  public get type(): GraphQLModuleDefinitionType.HTTP {
    return GraphQLModuleDefinitionType.HTTP
  }

  public get url(): string {
    return this._url;
  }
}

export interface ILocalGraphQLModuleDefinition extends IGraphQLModuleDefinition {
  type: GraphQLModuleDefinitionType.LOCAL,
  schema: GraphQLSchemaModule
}

export class LocalGraphQLModuleDefinition implements ILocalGraphQLModuleDefinition {
  private _name: string;
  private _schema: GraphQLSchemaModule;

  constructor(name: string, schema: GraphQLSchemaModule) {
    this._name = name;
    this._schema = schema;
  }

  public get name() : string {
    return this._name;
  }

  public get type(): GraphQLModuleDefinitionType.LOCAL {
    return GraphQLModuleDefinitionType.LOCAL;
  }

  public get schema(): GraphQLSchemaModule {
    return this._schema;
  }
}
