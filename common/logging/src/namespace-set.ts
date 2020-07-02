import { TransformableInfo } from 'logform';

export class NamespaceSetError extends Error { }

export class NamespaceSet {
  private static NAMESPACE_MATCHER = /^(\/[a-z0-9]([-a-z0-9]*[a-z0-9])*)*\/([a-z0-9]([-a-z0-9]*[a-z0-9])*|\*)$/i;

  private namespaces: Set<string>;
  private filters: RegExp[];

  constructor() {
    this.namespaces = new Set<string>();
    this.filters = [];

    this.refreshMatchers();
  }

  public addNamespace(namespace: string) : void {
    if (this.namespaces.has(namespace)) {
      return;
    }

    if (!this.validateNamespace(namespace)) {
      throw new NamespaceSetError(`Invalid namespace '${namespace}'. A namespace must comprise one or more alphanumeric segments, separated by '/', optionally with a trailling wildcard (*). For example, '/root/level2/*'` );
    }

    this.namespaces.add(namespace);
    this.refreshMatchers();
  }

  public getNamespaces() {
    return [ ...this.namespaces ];
  }

  public matches(namespace: string | undefined) : boolean {
    if (!namespace) {
      return true;
    }

    return this.filters.some(filter => filter.test(namespace));
  }

  private refreshMatchers() {
    const filters: RegExp[] = [];
    this.namespaces.forEach((namespace) => filters.push(this.createMatcher(namespace)));
    
    this.filters = filters;
  }

  private createMatcher(namespace: string) : RegExp {
    return new RegExp(`^${namespace.replace('*', '.*')}$`);
  }

  private validateNamespace(namespace: string): boolean {
    return NamespaceSet.NAMESPACE_MATCHER.test(namespace);
  }
}