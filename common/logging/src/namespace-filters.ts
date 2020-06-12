export interface NamespaceFilter {
  isEnabled: boolean;
}

export class NamespaceFilters {
  private _namespaces: Map<string, NamespaceFilter>
  private _filters: FilterMatcher[];
  private _level: string;

  constructor(level: string, filters?: string | string[]) {
    this._filters = [];
    this._namespaces = new Map();
    this._level = level;
    
    this.setFilters(filters || []);
  }

  public get level() : string {
    return this._level;
  }

  public get filters() : string[] {
    return this._filters.map(filter => filter.name);
  }

  public create(namespace: string) : NamespaceFilter {
    namespace = namespace.toUpperCase();

    if (this._namespaces.has(namespace)) {
      // @ts-ignore we checked first
      return this._namespaces.get(namespace);
    }

    const filter: NamespaceFilter = { isEnabled: this.isEnabled(namespace) };

    this._namespaces.set(namespace, filter);

    return filter;
  }

  public setFilters(filters: string | string[]) : void {
    if (!Array.isArray(filters)) {
      filters = filters.split(',');
    }

    this.updateFilters(filters);

    this._namespaces.forEach((filter, namespace) => { filter.isEnabled = this.isEnabled(namespace) });
  }

  private updateFilters(filters: string[]) {
    const entries: FilterMatcher[] = [];

    for (let filter of filters) {
      filter = filter.trim().toUpperCase();
      entries.push({ name: filter, matcher: new RegExp(`^${filter.replace(':', '\\:').replace('*', '.*')}$`) })
    }

    this._filters = entries;
  }

  private isEnabled(namespace: string) : boolean {
    for (const [index, entry] of this._filters.entries()) {
      if (entry.matcher.test(namespace)) {
        return true;
      }
    }

    return false;
  }
}

interface FilterMatcher {
  name: string;
  matcher: RegExp;
}