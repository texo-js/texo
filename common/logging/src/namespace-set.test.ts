import { NamespaceSet, NamespaceSetError } from './namespace-set';

describe('namespace filters', () => {
  describe('filters are applied correctly', () => {
    let nsSet: NamespaceSet;

    beforeAll(() => {
      nsSet = new NamespaceSet();  
      nsSet.addNamespace('/base/allowed');
      nsSet.addNamespace('/base/anything/*');
    });

    it('allows entries included in the filter', () => {
      const isAllowed = nsSet.matches('/base/allowed');
      expect(isAllowed).toBeTruthy();
    });

    it('blocks entries not included in the filter', () => {
      const isAllowed = nsSet.matches('/base/blocked');
      expect(isAllowed).toBeFalsy();
    });

    it('allows entries matching wildcard filters', () => {
      const isAllowed = nsSet.matches('/base/anything/else');
      expect(isAllowed).toBeTruthy();
    });

    it('allows entries with no namespace', () => {
      const isAllowed = nsSet.matches(undefined);
      expect(isAllowed).toBeTruthy();
    });
  });

  describe('namespaces are validated correctly', () => {
    let filter: NamespaceSet;

    beforeEach(() => {
      filter = new NamespaceSet();
    });

    it('allows valid namespaces', () => {
      expect(() => { filter.addNamespace('/namespace') }).not.toThrow()
    });

    it('allows valid wildcard namespaces', () => {
      expect(() => { filter.addNamespace('/namespace/*') }).not.toThrow()
    });

    it('prevents blank namespaces', () => {
      expect(() => { filter.addNamespace('') }).toThrow(NamespaceSetError);
    });

    it('prevents incorrectly delimited namespaces', () => {
      expect(() => { filter.addNamespace('namespace/level2') }).toThrow(NamespaceSetError);
    });

    it('prevents namespaces with non-alphanumeric characters', () => {
      expect(() => { filter.addNamespace('/namespace/level!2') }).toThrow(NamespaceSetError);
    });

    it('allows hyphens in namespace segments', () => {
      expect(() => { filter.addNamespace('/namespace/level-2') }).not.toThrow();
    });

    it('prevents hyphens at start of a segment', () => {
      expect(() => { filter.addNamespace('namespace/-level2') }).toThrow(NamespaceSetError);
    });

    it('prevents hyphens at end of a segment', () => {
      expect(() => { filter.addNamespace('namespace/level2-') }).toThrow(NamespaceSetError);
    });

    it('ignores duplicate namespaces', () => {
      filter.addNamespace('/root/level2');
      filter.addNamespace('/root/level2');

      expect(filter.getNamespaces()).toHaveLength(1);
    });
  });
});