import { ServiceDefinition } from '@apollo/federation';
import { GraphQLDataSource } from '@apollo/gateway';

import { LocalService } from './local-service';
import { HttpService } from './http-service';
import { HttpServiceDefinition } from './http-service-definition';
import { LocalServiceDefinition } from './local-service-definition';

export type ServiceBuilder = (service: Pick<ServiceDefinition, 'name' | 'url'>) => GraphQLDataSource;

export type ServiceModuleDefinition = LocalServiceDefinition | HttpServiceDefinition;

export class ServiceBuilderFactory {
  #modules: ServiceModuleDefinition[];
  #lookup: Map<string, ServiceModuleDefinition>;

  constructor(modules: ServiceModuleDefinition[]) {
    this.#modules = modules;
    this.#lookup = new Map(modules.map(module => [ module.url.href, module ]));
  }

  getServices(): Pick<ServiceDefinition, "name" | "url">[] {
    return this.#modules.map(({ name, url }) => ({ name, url: url.href }));
  }

  getBuilder(): ServiceBuilder {
    return (service: Pick<ServiceDefinition, 'name' | 'url'>) => {
      if (!service.url) {
        throw new Error('Service definitions must have a URL');
      }

      const definition = this.#lookup.get(service.url);
      if (!definition) {
        throw new Error(`Unknown module definition with URL '${service.url}'.`);
      }

      if (definition instanceof LocalServiceDefinition) {
        return new LocalService(definition);
      }

      if (definition instanceof HttpServiceDefinition) {
        return new HttpService(definition);
      }

      throw new Error(`Unsupported module definition type '${definition}'.`);
    };
  }
}