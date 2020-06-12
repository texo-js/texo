import { logger, setLogger } from './logger';
import { createLogger, NamespaceFilters } from '@texo/logging'

describe('the default logger can be managed', function () {
  test('the logger can be set and retrieved', function () {
      const filters = new NamespaceFilters('debug', '*');
      const aLogger = createLogger('test', filters, {});
    
      setLogger(aLogger);

      expect(logger).toBe(aLogger);
  });
});