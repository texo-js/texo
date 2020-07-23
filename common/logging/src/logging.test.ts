import { TransformableInfo } from 'logform';
import { LEVEL, MESSAGE } from 'triple-beam';
import { Format } from '@texo/logging';

import { Loggers } from './logging';

describe('@texo/logging', () => {
  describe('system logger', () => {
    it('correctly manages the system logger', function () {
        const logger = Loggers.create({ options: { level: 'info' } });
        Loggers.setSystem(logger);

        expect(Loggers.getSystem()).toBe(logger);
    });
  });

  describe('child loggers', () => {
    it('updates the namespace correctly', () => {
      const parent = Loggers.create({ options: { level: 'debug' }, namespace: 'parent' });
      const child = Loggers.createChild({ parent, namespace: 'child' });

      expect (child?.defaultMeta?.ns).toBe('parent/child');
    });
  });
});
