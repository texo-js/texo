import { NamespacedLogger } from '@texo/logging'

import { IGraphQLModuleDefinition } from './graphql-modules'

export interface GatewayServerConfig {
  applicationName: string;
  applicationVersion: string;
  logger: NamespacedLogger;
  modules: IGraphQLModuleDefinition[]
}


