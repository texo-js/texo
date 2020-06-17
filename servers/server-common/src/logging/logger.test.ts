import { logger, setLogger } from './logger';
import { createLogger, NamespaceFilters } from '@texo/logging'

describe('the default logger can be managed', function () {
  test('the logger can be set and retrieved', function () {
      const filters = new NamespaceFilters('debug', '*');
      const theLogger = createLogger('test', filters, {});
    
      setLogger(theLogger);

      expect(logger).toBe(theLogger);
  });
});