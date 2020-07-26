import { URL } from 'url';

export abstract class ServiceDefinitionBase {
  #name: string;
  #url: URL;

  constructor(name: string, url: string | URL) {
    this.#name = name;
    this.#url = typeof (url) === 'string' ? new URL(url) : url;
  }

  get name(): string {
    return this.#name;
  }

  get url(): URL {
    return this.#url;
  }
}
