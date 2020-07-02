import { LEVEL } from 'triple-beam';

import { Filters, FilterError } from './filters';
import { NamespaceSet } from './namespace-set';
import { TransformableInfo } from 'logform';

describe('namespace filter format', () => {
  describe('options are validated', () => {
    it('validates that the filter level is valid', () => {
      const namespaces = new NamespaceSet();
      const options = { filterLevel: 'nonsense', namespaces };

      expect(() => Filters.create(options)).toThrow(FilterError);
    });
  });

  const namespaces = new NamespaceSet();
  namespaces.addNamespace('/level-1/level-2');

  const filter = Filters.create({ filterLevel: 'info', namespaces });

  it('allows entries with priority below the threshold regardless of namespace', () => {
    const info = toInfo({
      level: 'warn',
      message: 'a message',
      ns: '/not-included'
    });

    const result = filter.transform(info);
    expect(result).toBeTruthy();
  });

  it('allows entries with priority above the threshold if there is a namespace match', () => {
    const info = toInfo({
      level: 'debug',
      message: 'a message',
      ns: '/level-1/level-2'
    });

    const result = filter.transform(info);
    expect(result).toBeTruthy();
  });

  it('prevents entries with priority above the threshold if there is no namespace match', () => {
    const info = toInfo({
      level: 'debug',
      message: 'a message',
      ns: '/level-1/something-else'
    });

    const result = filter.transform(info);
    expect(result).toBeFalsy();
  });

  it('prevents entries with undefined levels', () => {
    const info = toInfo({
      level: 'nonsense',
      message: 'a message',
      ns: '/level-1/level-2'
    });

    const result = filter.transform(info);
    expect(result).toBeFalsy();
  });

  interface TransformableInfoInternal extends TransformableInfo {
    [LEVEL]: string;
  }

  function toInfo(info: TransformableInfo) : TransformableInfoInternal {
    return { ...info, [LEVEL]: info.level }
  }
});