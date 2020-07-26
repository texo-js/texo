import { URL } from 'url';
import { ServiceDefinitionBase } from "./service-definition-base";

export class HttpServiceDefinition extends ServiceDefinitionBase {
  constructor(name: string, url: string | URL) {
    super(name, url);

    if (this.url.protocol !== 'http:' && this.url.protocol !== 'https:') {
      throw new Error(`HTTP service URLs must have the 'http:' or 'https:' protocol.`);
    }
  }
}
